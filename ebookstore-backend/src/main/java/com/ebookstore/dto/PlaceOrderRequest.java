package com.ebookstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PlaceOrderRequest(
        @NotNull(message = "Address ID is required")
        Long addressId,

        @NotBlank(message = "Payment method is required")
        String paymentMethod,

        Boolean useGiftPoints,

        String cardNumber,
        String cardExpiry,
        String cardCvv
) {
    public PlaceOrderRequest {
        if (useGiftPoints == null) useGiftPoints = false;
    }
}
