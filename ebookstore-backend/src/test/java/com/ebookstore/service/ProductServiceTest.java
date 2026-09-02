package com.ebookstore.service;

import com.ebookstore.dto.ProductDetailResponse;
import com.ebookstore.dto.ProductSummaryResponse;
import com.ebookstore.entity.Category;
import com.ebookstore.entity.Product;
import com.ebookstore.exception.ResourceNotFoundException;
import com.ebookstore.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock ProductRepository productRepository;
    @InjectMocks ProductService productService;

    private Product product;

    @BeforeEach
    void setUp() {
        Category cat = Category.builder().id(1L).name("Fiction").build();
        product = Product.builder()
                .id(1L).title("Clean Code").author("R.C. Martin")
                .price(new BigDecimal("39.99")).stockQuantity(10)
                .rating(new BigDecimal("4.7")).category(cat)
                .build();
    }

    @Test
    void testGetProductById_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        ProductDetailResponse res = productService.getProductById(1L);
        assertThat(res.title()).isEqualTo("Clean Code");
        assertThat(res.price()).isEqualByComparingTo("39.99");
    }

    @Test
    void testGetProductById_NotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> productService.getProductById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void testGetFeaturedProducts() {
        when(productRepository.findTop8ByOrderByRatingDesc()).thenReturn(List.of(product));
        List<ProductSummaryResponse> res = productService.getFeaturedProducts();
        assertThat(res).hasSize(1);
        assertThat(res.get(0).title()).isEqualTo("Clean Code");
    }

    @Test
    void testGetRelatedProducts() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.findTop4ByCategoryIdAndIdNot(1L, 1L)).thenReturn(List.of());
        List<ProductSummaryResponse> res = productService.getRelatedProducts(1L);
        assertThat(res).isEmpty();
    }
}
