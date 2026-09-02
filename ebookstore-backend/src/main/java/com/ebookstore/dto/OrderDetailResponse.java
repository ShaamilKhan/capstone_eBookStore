package com.ebookstore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderDetailResponse(
        Long id,
        String status,
        BigDecimal totalAmount,
        LocalDateTime placedAt,
        LocalDateTime cancelledAt,
        String paymentMethod,
        String paymentStatus,
        Integer giftPointsUsed,
        Integer giftPointsEarned,
        AddressResponse address,
        List<OrderItemResponse> items
) {}
