package com.ebookstore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderSummaryResponse(
        Long id,
        String status,
        BigDecimal totalAmount,
        LocalDateTime placedAt,
        int itemCount,
        String paymentMethod,
        String paymentStatus
) {}
