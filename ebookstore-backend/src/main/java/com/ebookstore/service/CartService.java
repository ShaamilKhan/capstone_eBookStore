package com.ebookstore.service;

import com.ebookstore.dto.*;
import com.ebookstore.entity.CartItem;
import com.ebookstore.entity.Product;
import com.ebookstore.entity.User;
import com.ebookstore.exception.BadRequestException;
import com.ebookstore.exception.ResourceNotFoundException;
import com.ebookstore.repository.CartItemRepository;
import com.ebookstore.repository.ProductRepository;
import com.ebookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("30.00");
    private static final BigDecimal SHIPPING_COST = new BigDecimal("4.99");

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    public CartResponse getCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        return buildCartResponse(items);
    }

    @Transactional
    public CartResponse addItem(Long userId, AddToCartRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStockQuantity() < request.quantity()) {
            throw new BadRequestException("Insufficient stock for product: " + product.getTitle());
        }

        CartItem existing = cartItemRepository.findByUserIdAndProductId(userId, request.productId()).orElse(null);
        if (existing != null) {
            int newQty = existing.getQuantity() + request.quantity();
            if (product.getStockQuantity() < newQty) {
                throw new BadRequestException("Insufficient stock for product: " + product.getTitle());
            }
            existing.setQuantity(newQty);
            cartItemRepository.save(existing);
        } else {
            CartItem item = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.quantity())
                    .build();
            cartItemRepository.save(item);
        }
        return getCart(userId);
    }

    @Transactional
    public CartResponse updateItem(Long userId, Long cartItemId, UpdateCartItemRequest request) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        if (!item.getUser().getId().equals(userId)) {
            throw new BadRequestException("Cart item does not belong to user");
        }
        if (item.getProduct().getStockQuantity() < request.quantity()) {
            throw new BadRequestException("Insufficient stock");
        }
        item.setQuantity(request.quantity());
        cartItemRepository.save(item);
        return getCart(userId);
    }

    @Transactional
    public CartResponse removeItem(Long userId, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        if (!item.getUser().getId().equals(userId)) {
            throw new BadRequestException("Cart item does not belong to user");
        }
        cartItemRepository.delete(item);
        return getCart(userId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    private CartResponse buildCartResponse(List<CartItem> items) {
        List<CartItemResponse> cartItemResponses = items.stream().map(ci -> {
            BigDecimal itemTotal = ci.getProduct().getPrice()
                    .multiply(BigDecimal.valueOf(ci.getQuantity()));
            return new CartItemResponse(ci.getId(), productService.toSummary(ci.getProduct()),
                    ci.getQuantity(), itemTotal);
        }).toList();

        BigDecimal subtotal = cartItemResponses.stream()
                .map(CartItemResponse::itemTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal shipping = subtotal.compareTo(FREE_SHIPPING_THRESHOLD) >= 0
                ? BigDecimal.ZERO : SHIPPING_COST;
        BigDecimal total = subtotal.add(shipping);
        int itemCount = items.stream().mapToInt(CartItem::getQuantity).sum();

        return new CartResponse(cartItemResponses, subtotal, shipping, total, itemCount);
    }
}
