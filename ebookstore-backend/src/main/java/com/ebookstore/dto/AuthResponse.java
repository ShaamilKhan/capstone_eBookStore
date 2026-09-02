package com.ebookstore.dto;

public record AuthResponse(
        String token,
        Long id,
        String fullName,
        String email,
        Integer giftPoints
) {}
