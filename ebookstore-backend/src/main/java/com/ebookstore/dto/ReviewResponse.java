package com.ebookstore.dto;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        Long userId,
        String fullName,
        Integer rating,
        String comment,
        LocalDateTime createdAt
) {}
