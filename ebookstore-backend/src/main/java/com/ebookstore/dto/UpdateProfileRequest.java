package com.ebookstore.dto;

public record UpdateProfileRequest(
        String fullName,
        String phone
) {}
