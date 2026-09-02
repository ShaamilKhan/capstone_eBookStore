package com.ebookstore.service;

import com.ebookstore.dto.*;
import com.ebookstore.entity.*;
import com.ebookstore.exception.BadRequestException;
import com.ebookstore.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock CartItemRepository cartItemRepository;
    @Mock ProductRepository  productRepository;
    @Mock UserRepository     userRepository;
    @Mock ProductService     productService;

    @InjectMocks CartService cartService;

    private User user;
    private Product product;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).email("test@test.com").giftPoints(0).build();
        product = Product.builder().id(2L).title("1984").price(new BigDecimal("11.99")).stockQuantity(5).build();
    }

    @Test
    void testGetCart_Empty() {
        when(cartItemRepository.findByUserId(1L)).thenReturn(Collections.emptyList());
        CartResponse cart = cartService.getCart(1L);
        assertThat(cart.items()).isEmpty();
        assertThat(cart.subtotal()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    void testAddItem_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(productRepository.findById(2L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByUserIdAndProductId(1L, 2L)).thenReturn(Optional.empty());
        when(cartItemRepository.findByUserId(1L)).thenReturn(List.of(
                CartItem.builder().id(1L).user(user).product(product).quantity(2).build()
        ));
        when(productService.toSummary(any())).thenReturn(
                new ProductSummaryResponse(2L, "1984", "Orwell", new BigDecimal("11.99"), null, new BigDecimal("4.7"), null, null, 5)
        );

        CartResponse cart = cartService.addItem(1L, new AddToCartRequest(2L, 2));
        assertThat(cart.items()).hasSize(1);
        verify(cartItemRepository).save(any(CartItem.class));
    }

    @Test
    void testAddItem_OutOfStock() {
        product.setStockQuantity(0);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(productRepository.findById(2L)).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> cartService.addItem(1L, new AddToCartRequest(2L, 1)))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Insufficient stock");
    }

    @Test
    void testAddItem_AlreadyInCart_QuantityIncremented() {
        CartItem existing = CartItem.builder().id(1L).user(user).product(product).quantity(1).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(productRepository.findById(2L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByUserIdAndProductId(1L, 2L)).thenReturn(Optional.of(existing));
        when(cartItemRepository.findByUserId(1L)).thenReturn(List.of(
                CartItem.builder().id(1L).user(user).product(product).quantity(2).build()
        ));
        when(productService.toSummary(any())).thenReturn(
                new ProductSummaryResponse(2L, "1984", "Orwell", new BigDecimal("11.99"), null, new BigDecimal("4.7"), null, null, 5)
        );

        cartService.addItem(1L, new AddToCartRequest(2L, 1));
        verify(cartItemRepository).save(existing);
        assertThat(existing.getQuantity()).isEqualTo(2);
    }

    @Test
    void testRemoveItem_Success() {
        CartItem item = CartItem.builder().id(10L).user(user).product(product).quantity(1).build();
        when(cartItemRepository.findById(10L)).thenReturn(Optional.of(item));
        when(cartItemRepository.findByUserId(1L)).thenReturn(Collections.emptyList());

        CartResponse cart = cartService.removeItem(1L, 10L);
        verify(cartItemRepository).delete(item);
        assertThat(cart.items()).isEmpty();
    }

    @Test
    void testRemoveItem_NotOwner() {
        User other = User.builder().id(99L).email("other@test.com").build();
        CartItem item = CartItem.builder().id(10L).user(other).product(product).quantity(1).build();
        when(cartItemRepository.findById(10L)).thenReturn(Optional.of(item));

        assertThatThrownBy(() -> cartService.removeItem(1L, 10L))
                .isInstanceOf(BadRequestException.class);
    }
}
