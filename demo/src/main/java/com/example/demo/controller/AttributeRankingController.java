package com.example.demo.controller;  // Specifies the package for this class, which is part of the 'controller' package in the 'demo' module.

import org.springframework.http.ResponseEntity;  // Import for building response entities
import org.springframework.web.bind.annotation.*;  // Import for handling HTTP requests in controllers
import org.springframework.http.HttpStatus;  // Import for HTTP status codes

import com.example.demo.AttributeRanking;  // Importing the AttributeRanking model class
import com.example.demo.AttributeRankingService;  // Importing the service class responsible for business logic

// The controller class responsible for handling HTTP requests related to attribute rankings
@RestController  // Marks the class as a REST controller to handle HTTP requests
@RequestMapping("/api/survey")  // Specifies the base URL path for all endpoints in this controller
public class AttributeRankingController {

    private final AttributeRankingService attributeRankingService;  // Declare the service to handle the business logic

    // ✅ Constructor injection is used here (Recommended practice in Spring)
    // Dependency injection is handled by Spring, injecting the service into the controller
    public AttributeRankingController(AttributeRankingService attributeRankingService) {
        this.attributeRankingService = attributeRankingService;
    }

    // Endpoint to handle POST requests for saving attribute rankings
    @PostMapping("/save-ranking")  // Specifies that this method handles POST requests at /api/survey/save-ranking
    public ResponseEntity<String> saveAttributeRanking(@RequestBody AttributeRanking attributeRanking) {
        try {
            // Call the service layer to save the attribute ranking
            attributeRankingService.saveAttributeRanking(attributeRanking);
            // Return a success response if the saving operation was successful
            return ResponseEntity.ok("Attribute ranking saved successfully!");
        } catch (Exception e) {
            // Return an error response with a detailed message if something goes wrong
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save attribute ranking: " + e.getMessage());
        }
    }
}
