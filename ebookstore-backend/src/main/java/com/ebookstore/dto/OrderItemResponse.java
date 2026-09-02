package com.ebookstore.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        ProductSummaryResponse product,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal subtotal
) {}
