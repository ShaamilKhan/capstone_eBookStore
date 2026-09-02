package com.ebookstore.dto;

import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        ProductSummaryResponse product,
        Integer quantity,
        BigDecimal itemTotal
) {}
