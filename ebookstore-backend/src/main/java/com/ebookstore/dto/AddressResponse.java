package com.ebookstore.dto;

public record AddressResponse(
        Long id,
        String label,
        String street,
        String city,
        String state,
        String zipCode,
        String country,
        Boolean isDefault
) {}
