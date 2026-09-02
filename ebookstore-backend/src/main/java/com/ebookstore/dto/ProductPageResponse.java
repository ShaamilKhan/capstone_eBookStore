package com.ebookstore.dto;

import java.util.List;

public record ProductPageResponse(
        List<ProductSummaryResponse> content,
        long totalElements,
        int totalPages,
        int currentPage,
        int pageSize
) {}
