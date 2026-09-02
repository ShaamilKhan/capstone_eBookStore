package com.ebookstore.controller;

import com.ebookstore.entity.Brand;
import com.ebookstore.exception.ResourceNotFoundException;
import com.ebookstore.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandRepository brandRepository;

    @GetMapping
    public ResponseEntity<List<Brand>> getAll() {
        return ResponseEntity.ok(brandRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Brand> getById(@PathVariable Long id) {
        return ResponseEntity.ok(brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found")));
    }
}
