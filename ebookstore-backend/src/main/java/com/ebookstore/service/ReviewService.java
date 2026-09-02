package com.ebookstore.service;

import com.ebookstore.dto.CreateReviewRequest;
import com.ebookstore.dto.ReviewResponse;
import com.ebookstore.entity.Product;
import com.ebookstore.entity.Review;
import com.ebookstore.entity.User;
import com.ebookstore.exception.BadRequestException;
import com.ebookstore.exception.ResourceNotFoundException;
import com.ebookstore.repository.ProductRepository;
import com.ebookstore.repository.ReviewRepository;
import com.ebookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse createReview(Long userId, CreateReviewRequest request) {
        if (reviewRepository.findByUserIdAndProductId(userId, request.productId()).isPresent()) {
            throw new BadRequestException("You have already reviewed this product");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(request.rating())
                .comment(request.comment())
                .build();
        reviewRepository.save(review);

        // Recalculate product rating
        Double avg = reviewRepository.findAverageRatingByProductId(request.productId());
        if (avg != null) {
            product.setRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
            productRepository.save(product);
        }

        return toResponse(review);
    }

    public List<ReviewResponse> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream().map(this::toResponse).toList();
    }

    private ReviewResponse toResponse(Review r) {
        return new ReviewResponse(r.getId(), r.getUser().getId(), r.getUser().getFullName(),
                r.getRating(), r.getComment(), r.getCreatedAt());
    }
}
