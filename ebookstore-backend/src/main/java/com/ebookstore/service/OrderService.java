package com.ebookstore.service;

import com.ebookstore.dto.*;
import com.ebookstore.entity.*;
import com.ebookstore.exception.BadRequestException;
import com.ebookstore.exception.ResourceNotFoundException;
import com.ebookstore.exception.UnauthorizedException;
import com.ebookstore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final BigDecimal POINTS_PER_DOLLAR = BigDecimal.ONE;
    private static final BigDecimal POINTS_VALUE = new BigDecimal("0.01"); // 100 pts = $1
    private static final BigDecimal MAX_POINTS_DISCOUNT_PCT = new BigDecimal("0.20");

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ProductService productService;

    @Transactional
    public OrderDetailResponse placeOrder(Long userId, PlaceOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Address address = addressRepository.findById(request.addressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        if (!address.getUser().getId().equals(userId)) {
            throw new BadRequestException("Address does not belong to user");
        }

        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        // Validate stock and calculate subtotal
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem ci : cartItems) {
            Product p = ci.getProduct();
            if (p.getStockQuantity() < ci.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + p.getTitle());
            }
            subtotal = subtotal.add(p.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())));
        }

        // Gift points discount
        BigDecimal giftDiscount = BigDecimal.ZERO;
        int giftPointsUsed = 0;
        if (Boolean.TRUE.equals(request.useGiftPoints()) && user.getGiftPoints() > 0) {
            BigDecimal maxDiscount = subtotal.multiply(MAX_POINTS_DISCOUNT_PCT);
            BigDecimal availableDiscount = BigDecimal.valueOf(user.getGiftPoints()).multiply(POINTS_VALUE);
            giftDiscount = availableDiscount.min(maxDiscount).setScale(2, RoundingMode.DOWN);
            giftPointsUsed = giftDiscount.divide(POINTS_VALUE, 0, RoundingMode.DOWN).intValue();
        }

        BigDecimal shipping = subtotal.compareTo(new BigDecimal("30.00")) >= 0
                ? BigDecimal.ZERO : new BigDecimal("4.99");
        BigDecimal totalAmount = subtotal.add(shipping).subtract(giftDiscount).max(BigDecimal.ZERO);
        int giftPointsEarned = totalAmount.setScale(0, RoundingMode.DOWN).intValue();

        // Build order
        Order order = Order.builder()
                .user(user)
                .address(address)
                .status("CONFIRMED")
                .totalAmount(totalAmount)
                .giftPointsUsed(giftPointsUsed)
                .giftPointsEarned(giftPointsEarned)
                .paymentMethod(request.paymentMethod())
                .paymentStatus("PAID")
                .build();
        orderRepository.save(order);

        // Save order items, deduct stock
        for (CartItem ci : cartItems) {
            Product p = ci.getProduct();
            OrderItem oi = OrderItem.builder()
                    .order(order)
                    .product(p)
                    .quantity(ci.getQuantity())
                    .unitPrice(p.getPrice())
                    .subtotal(p.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())))
                    .build();
            order.getItems().add(oi);
            p.setStockQuantity(p.getStockQuantity() - ci.getQuantity());
            productRepository.save(p);
        }
        orderRepository.save(order);

        // Clear cart, update gift points
        cartItemRepository.deleteByUserId(userId);
        user.setGiftPoints(user.getGiftPoints() - giftPointsUsed + giftPointsEarned);
        userRepository.save(user);

        return toDetailResponse(order);
    }

    public PageResponse<OrderSummaryResponse> getOrders(Long userId, int page, int size) {
        Page<Order> orderPage = orderRepository.findByUserIdOrderByPlacedAtDesc(
                userId, PageRequest.of(page, size));
        List<OrderSummaryResponse> content = orderPage.getContent().stream()
                .map(o -> new OrderSummaryResponse(
                        o.getId(), o.getStatus(), o.getTotalAmount(), o.getPlacedAt(),
                        o.getItems().size(), o.getPaymentMethod(), o.getPaymentStatus()))
                .toList();
        return new PageResponse<>(content, orderPage.getTotalElements(),
                orderPage.getTotalPages(), orderPage.getNumber(), size);
    }

    public OrderDetailResponse getOrderById(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Access denied");
        }
        return toDetailResponse(order);
    }

    @Transactional
    public OrderDetailResponse cancelOrder(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Access denied");
        }
        if (!order.getStatus().equals("PENDING") && !order.getStatus().equals("CONFIRMED")) {
            throw new BadRequestException("Order cannot be cancelled in status: " + order.getStatus());
        }
        if (order.getPlacedAt().isBefore(LocalDateTime.now().minusHours(48))) {
            throw new BadRequestException("Order cannot be cancelled after 48 hours");
        }

        // Restore stock
        for (OrderItem oi : order.getItems()) {
            Product p = oi.getProduct();
            p.setStockQuantity(p.getStockQuantity() + oi.getQuantity());
            productRepository.save(p);
        }

        // Refund gift points used
        User user = order.getUser();
        user.setGiftPoints(user.getGiftPoints() + order.getGiftPointsUsed() - order.getGiftPointsEarned());
        userRepository.save(user);

        order.setStatus("CANCELLED");
        order.setCancelledAt(LocalDateTime.now());
        orderRepository.save(order);
        return toDetailResponse(order);
    }

    private OrderDetailResponse toDetailResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(oi -> new OrderItemResponse(oi.getId(), productService.toSummary(oi.getProduct()),
                        oi.getQuantity(), oi.getUnitPrice(), oi.getSubtotal()))
                .toList();
        Address a = order.getAddress();
        AddressResponse addressResponse = a == null ? null : new AddressResponse(
                a.getId(), a.getLabel(), a.getStreet(), a.getCity(), a.getState(),
                a.getZipCode(), a.getCountry(), a.getIsDefault());
        return new OrderDetailResponse(order.getId(), order.getStatus(), order.getTotalAmount(),
                order.getPlacedAt(), order.getCancelledAt(), order.getPaymentMethod(),
                order.getPaymentStatus(), order.getGiftPointsUsed(), order.getGiftPointsEarned(),
                addressResponse, items);
    }
}
