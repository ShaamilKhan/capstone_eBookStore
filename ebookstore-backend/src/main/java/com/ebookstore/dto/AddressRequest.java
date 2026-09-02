package com.ebookstore.dto;

public record AddressRequest(
        String label,
        String street,
        String city,
        String state,
        String zipCode,
        String country,
        Boolean isDefault
) {}
