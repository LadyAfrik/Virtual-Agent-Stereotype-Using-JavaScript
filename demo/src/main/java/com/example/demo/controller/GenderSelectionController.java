package com.example.demo.controller; // Package declaration

// Import necessary Spring classes for RESTful API creation
import org.springframework.beans.factory.annotation.Autowired; // For automatic dependency injection
import org.springframework.http.ResponseEntity; // For returning HTTP responses
import org.springframework.web.bind.annotation.*; // Annotations to define REST API endpoints

// Import custom service and model classes
import com.example.demo.GenderSelection; // GenderSelection model class (represents a user's gender selection)
import com.example.demo.GenderSelectionService; // Service class for handling gender selection operations

// Controller for handling requests related to gender selection
@RestController
@RequestMapping("/api/survey") // Base path for this controller's endpoints
public class GenderSelectionController {

    @Autowired // Spring will automatically inject the GenderSelectionService dependency
    private GenderSelectionService genderSelectionService;

    // POST endpoint to save the gender selection submitted by the user
    @PostMapping("/save-gender")
    public ResponseEntity<String> saveGenderSelection(@RequestBody GenderSelection genderSelection) {
        // Call the service layer to save the gender selection
        genderSelectionService.saveGenderSelection(genderSelection);

        // Return a response with HTTP status 200 (OK) and a success message
        return ResponseEntity.ok("Gender selection saved successfully!");
    }
}
