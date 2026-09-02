package com.ebookstore.dto;

import java.math.BigDecimal;

public record ProductSummaryResponse(
        Long id,
        String title,
        String author,
        BigDecimal price,
        String imageUrl,
        BigDecimal rating,
        String categoryName,
        String brandName,
        Integer stockQuantity
) {}
