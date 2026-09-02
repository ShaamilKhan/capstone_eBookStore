package com.ebookstore.service;

import com.ebookstore.dto.ProductSummaryResponse;
import com.ebookstore.entity.Product;
import com.ebookstore.repository.OrderRepository;
import com.ebookstore.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    public List<ProductSummaryResponse> getRecommendations(Long userId) {
        List<Object[]> rows = orderRepository.findOrderedProductsWithCategory(userId);

        if (rows.isEmpty()) {
            return productRepository.findTop8ByOrderByRatingDesc().stream()
                    .limit(6).map(productService::toSummary).toList();
        }

        // Build set of already-ordered product IDs and category frequency map
        Set<Long> orderedProductIds = new HashSet<>();
        Map<Long, Long> categoryCount = new LinkedHashMap<>();

        for (Object[] row : rows) {
            Long productId  = ((Number) row[0]).longValue();
            Long categoryId = ((Number) row[1]).longValue();
            long freq       = ((Number) row[2]).longValue();
            orderedProductIds.add(productId);
            categoryCount.merge(categoryId, freq, Long::sum);
        }

        // Top 2 categories by frequency
        List<Long> topCategories = categoryCount.entrySet().stream()
                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                .limit(2)
                .map(Map.Entry::getKey)
                .toList();

        // Fetch top-rated products in those categories not yet ordered
        List<Product> recommendations = new ArrayList<>();
        for (Long catId : topCategories) {
            productRepository.findAll().stream()
                    .filter(p -> p.getCategory() != null && p.getCategory().getId().equals(catId))
                    .filter(p -> !orderedProductIds.contains(p.getId()))
                    .sorted(Comparator.comparing(Product::getRating).reversed())
                    .limit(3)
                    .forEach(recommendations::add);
        }

        return recommendations.stream().distinct().limit(6).map(productService::toSummary).toList();
    }
}
