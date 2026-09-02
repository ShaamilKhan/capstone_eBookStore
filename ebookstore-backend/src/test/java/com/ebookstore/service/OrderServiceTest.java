package com.ebookstore.service;

import com.ebookstore.dto.*;
import com.ebookstore.entity.*;
import com.ebookstore.exception.BadRequestException;
import com.ebookstore.exception.UnauthorizedException;
import com.ebookstore.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock OrderRepository    orderRepository;
    @Mock CartItemRepository cartItemRepository;
    @Mock ProductRepository  productRepository;
    @Mock UserRepository     userRepository;
    @Mock AddressRepository  addressRepository;
    @Mock ProductService     productService;

    @InjectMocks OrderService orderService;

    private User user;
    private Address address;
    private Product product;
    private CartItem cartItem;

    @BeforeEach
    void setUp() {
        user    = User.builder().id(1L).email("test@test.com").giftPoints(0).build();
        address = Address.builder().id(1L).user(user).street("123 Main").city("NYC").build();
        product = Product.builder().id(2L).title("Clean Code")
                .price(new BigDecimal("39.99")).stockQuantity(10).build();
        cartItem = CartItem.builder().id(1L).user(user).product(product).quantity(2).build();
    }

    @Test
    void testPlaceOrder_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(addressRepository.findById(1L)).thenReturn(Optional.of(address));
        when(cartItemRepository.findByUserId(1L)).thenReturn(List.of(cartItem));
        when(orderRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(productService.toSummary(any())).thenReturn(
                new ProductSummaryResponse(2L, "Clean Code", "Martin", new BigDecimal("39.99"), null, new BigDecimal("4.7"), null, null, 8)
        );

        PlaceOrderRequest req = new PlaceOrderRequest(1L, "CREDIT_CARD", false, "4111111111111111", "12/26", "123");
        OrderDetailResponse res = orderService.placeOrder(1L, req);

        assertThat(res.status()).isEqualTo("CONFIRMED");
        assertThat(res.totalAmount()).isGreaterThan(BigDecimal.ZERO);
        verify(cartItemRepository).deleteByUserId(1L);
        assertThat(product.getStockQuantity()).isEqualTo(8); // 10 - 2
    }

    @Test
    void testPlaceOrder_EmptyCart() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(addressRepository.findById(1L)).thenReturn(Optional.of(address));
        when(cartItemRepository.findByUserId(1L)).thenReturn(List.of());

        assertThatThrownBy(() -> orderService.placeOrder(1L, new PlaceOrderRequest(1L, "CREDIT_CARD", false, null, null, null)))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("empty");
    }

    @Test
    void testCancelOrder_Success() {
        Order order = Order.builder().id(10L).user(user).address(address)
                .status("PENDING").placedAt(LocalDateTime.now()).giftPointsUsed(0).giftPointsEarned(5)
                .items(List.of(OrderItem.builder().product(product).quantity(2).build()))
                .build();
        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any())).thenReturn(order);
        when(productService.toSummary(any())).thenReturn(
                new ProductSummaryResponse(2L, "Clean Code", "Martin", new BigDecimal("39.99"), null, new BigDecimal("4.7"), null, null, 10)
        );

        OrderDetailResponse res = orderService.cancelOrder(1L, 10L);
        assertThat(res.status()).isEqualTo("CANCELLED");
        assertThat(product.getStockQuantity()).isEqualTo(12); // 10 + 2 restored
    }

    @Test
    void testCancelOrder_TooLate() {
        Order order = Order.builder().id(10L).user(user).status("PENDING")
                .placedAt(LocalDateTime.now().minusHours(49))
                .items(List.of()).build();
        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));

        assertThatThrownBy(() -> orderService.cancelOrder(1L, 10L))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("48 hours");
    }

    @Test
    void testCancelOrder_AlreadyCancelled() {
        Order order = Order.builder().id(10L).user(user).status("CANCELLED")
                .placedAt(LocalDateTime.now()).items(List.of()).build();
        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));

        assertThatThrownBy(() -> orderService.cancelOrder(1L, 10L))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void testCancelOrder_WrongUser() {
        User other = User.builder().id(99L).build();
        Order order = Order.builder().id(10L).user(other).status("PENDING")
                .placedAt(LocalDateTime.now()).items(List.of()).build();
        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));

        assertThatThrownBy(() -> orderService.cancelOrder(1L, 10L))
                .isInstanceOf(UnauthorizedException.class);
    }
}
