package com.ebookstore.dto;

import java.math.BigDecimal;

public record ProductDetailResponse(
        Long id,
        String title,
        String author,
        BigDecimal price,
        String imageUrl,
        BigDecimal rating,
        String categoryName,
        String brandName,
        Integer stockQuantity,
        String description,
        String isbn,
        Integer pages,
        String language,
        Integer estimatedDeliveryDays,
        int reviewCount,
        CategoryRef category,
        BrandRef brand
) {
    public record CategoryRef(Long id, String name) {}
    public record BrandRef(Long id, String name) {}
}
