package com.ebookstore.dto;

import java.time.LocalDateTime;

public record UserProfileResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        Integer giftPoints,
        LocalDateTime createdAt
) {}
