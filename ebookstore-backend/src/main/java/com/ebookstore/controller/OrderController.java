package com.ebookstore.controller;

import com.ebookstore.dto.*;
import com.ebookstore.entity.User;
import com.ebookstore.repository.UserRepository;
import com.ebookstore.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(User::getId)
                .orElseThrow(() -> new com.ebookstore.exception.UnauthorizedException("User not found"));
    }

    @PostMapping
    public ResponseEntity<OrderDetailResponse> placeOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PlaceOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.placeOrder(getUserId(userDetails), request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<OrderSummaryResponse>> getOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(orderService.getOrders(getUserId(userDetails), page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailResponse> getOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(getUserId(userDetails), id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderDetailResponse> cancelOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(getUserId(userDetails), id));
    }
}
