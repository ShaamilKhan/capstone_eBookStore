package com.ebookstore.controller;

import com.ebookstore.dto.ProductSummaryResponse;
import com.ebookstore.entity.User;
import com.ebookstore.repository.UserRepository;
import com.ebookstore.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ProductSummaryResponse>> getRecommendations(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userRepository.findByEmail(userDetails.getUsername())
                .map(User::getId).orElseThrow();
        return ResponseEntity.ok(recommendationService.getRecommendations(userId));
    }
}
