package com.ebookstore.controller;

import com.ebookstore.dto.*;
import com.ebookstore.repository.ReviewRepository;
import com.ebookstore.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ReviewRepository reviewRepository;

    @GetMapping
    public ResponseEntity<ProductPageResponse> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "relevance") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(productService.getProducts(
                categoryId, brandId, search, minPrice, maxPrice, sort, page, size));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<ProductSummaryResponse>> getFeatured() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailResponse> getById(@PathVariable Long id) {
        ProductDetailResponse detail = productService.getProductById(id);
        int reviewCount = reviewRepository.countByProductId(id);
        // Return with real review count
        return ResponseEntity.ok(new ProductDetailResponse(
                detail.id(), detail.title(), detail.author(), detail.price(), detail.imageUrl(),
                detail.rating(), detail.categoryName(), detail.brandName(), detail.stockQuantity(),
                detail.description(), detail.isbn(), detail.pages(), detail.language(),
                detail.estimatedDeliveryDays(), reviewCount, detail.category(), detail.brand()
        ));
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<List<ProductSummaryResponse>> getRelated(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getRelatedProducts(id));
    }
}
