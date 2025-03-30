package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import com.example.demo.AttributeRanking;
import com.example.demo.AttributeRankingService;

@RestController
@RequestMapping("/api/survey")
public class AttributeRankingController {

    private final AttributeRankingService attributeRankingService;

    // ✅ Use Constructor Injection (Recommended)
    public AttributeRankingController(AttributeRankingService attributeRankingService) {
        this.attributeRankingService = attributeRankingService;
    }

    @PostMapping("/save-ranking")
    public ResponseEntity<String> saveAttributeRanking(@RequestBody AttributeRanking attributeRanking) {
        try {
            attributeRankingService.saveAttributeRanking(attributeRanking);
            return ResponseEntity.ok("Attribute ranking saved successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save attribute ranking: " + e.getMessage());
        }
    }
}