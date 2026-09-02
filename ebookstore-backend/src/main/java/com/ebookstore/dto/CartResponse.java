package com.ebookstore.dto;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        List<CartItemResponse> items,
        BigDecimal subtotal,
        BigDecimal shipping,
        BigDecimal total,
        int itemCount
) {}
