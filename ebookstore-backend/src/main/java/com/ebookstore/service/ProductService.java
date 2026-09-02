package com.ebookstore.service;

import com.ebookstore.dto.*;
import com.ebookstore.entity.Brand;
import com.ebookstore.entity.Category;
import com.ebookstore.entity.Product;
import com.ebookstore.exception.ResourceNotFoundException;
import com.ebookstore.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public ProductPageResponse getProducts(Long categoryId, Long brandId, String search,
                                           BigDecimal minPrice, BigDecimal maxPrice,
                                           String sort, int page, int size) {
        Sort sorting = switch (sort != null ? sort : "relevance") {
            case "price_asc"  -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "rating"     -> Sort.by("rating").descending();
            default           -> Sort.by("id").ascending();
        };
        Pageable pageable = PageRequest.of(page, size, sorting);

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (brandId != null) {
                predicates.add(cb.equal(root.get("brand").get("id"), brandId));
            }
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("author")), pattern)
                ));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Product> productPage = productRepository.findAll(spec, pageable);
        List<ProductSummaryResponse> content = productPage.getContent().stream()
                .map(this::toSummary)
                .toList();
        return new ProductPageResponse(content, productPage.getTotalElements(),
                productPage.getTotalPages(), productPage.getNumber(), size);
    }

    public ProductDetailResponse getProductById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        int reviewCount = 0; // will be injected by controller or service layer if needed
        Category cat = p.getCategory();
        Brand brand = p.getBrand();
        return new ProductDetailResponse(
                p.getId(), p.getTitle(), p.getAuthor(), p.getPrice(), p.getImageUrl(), p.getRating(),
                cat != null ? cat.getName() : null, brand != null ? brand.getName() : null,
                p.getStockQuantity(), p.getDescription(), p.getIsbn(), p.getPages(), p.getLanguage(),
                p.getEstimatedDeliveryDays(), reviewCount,
                cat != null ? new ProductDetailResponse.CategoryRef(cat.getId(), cat.getName()) : null,
                brand != null ? new ProductDetailResponse.BrandRef(brand.getId(), brand.getName()) : null
        );
    }

    public List<ProductSummaryResponse> getRelatedProducts(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        if (p.getCategory() == null) return List.of();
        return productRepository.findTop4ByCategoryIdAndIdNot(p.getCategory().getId(), id)
                .stream().map(this::toSummary).toList();
    }

    public List<ProductSummaryResponse> getFeaturedProducts() {
        return productRepository.findTop8ByOrderByRatingDesc()
                .stream().map(this::toSummary).toList();
    }

    public ProductSummaryResponse toSummary(Product p) {
        return new ProductSummaryResponse(
                p.getId(), p.getTitle(), p.getAuthor(), p.getPrice(), p.getImageUrl(), p.getRating(),
                p.getCategory() != null ? p.getCategory().getName() : null,
                p.getBrand() != null ? p.getBrand().getName() : null,
                p.getStockQuantity()
        );
    }
}
