package com.example.demo.controller; // Specifies the package for this class, which is part of the 'controller' package in the 'demo' module.

// Import necessary classes for handling user operations, JWT generation, and Spring security
import com.example.demo.User; // User model class
import com.example.demo.UserRepository; // Repository for interacting with user data
import com.example.demo.security.JwtUtil; // Utility class for generating JWT tokens
import org.springframework.beans.factory.annotation.Autowired; // For automatic dependency injection
import org.springframework.http.ResponseEntity; // Used to return HTTP responses
import org.springframework.security.crypto.password.PasswordEncoder; // For encoding passwords securely
import org.springframework.web.bind.annotation.*; // Annotations for defining RESTful API endpoints

import java.util.Map; // Used for handling key-value pairs in request bodies
import java.util.Optional; // For handling optional user data (i.e., when a user may or may not exist in the repository)


@RestController // Denotes this class as a REST controller for handling HTTP requests
@RequestMapping("/auth") // Defines the base URL for all API endpoints in this controller
public class AuthController {

    // Autowire dependencies to interact with the user repository, JWT utility, and password encoder
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder; // Updated to use PasswordEncoder for hashing passwords

    // Endpoint for user registration
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Map<String, String> requestBody) {
        // Extract user details from the request body
        String email = requestBody.get("email");
        String password = requestBody.get("password");
        String confirmPassword = requestBody.get("confirmPassword");
        String gender = requestBody.get("gender");
        int age;

        // Handle invalid age format
        try {
            age = Integer.parseInt(requestBody.get("age"));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Error: Invalid age format.");
        }

        String levelOfStudy = requestBody.get("levelOfStudy");
        String affiliation = requestBody.get("affiliation");

        // Check if email is already in use
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email already in use");
        }

        // Check if the password and confirm password match
        if (!password.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body("Error: Passwords do not match");
        }

        // Create a new user and save it to the repository
        User user = new User(email, gender, age, levelOfStudy, affiliation, passwordEncoder.encode(password), 0, 0, 0);
        userRepository.save(user);

        // Return success message upon successful registration
        return ResponseEntity.ok("User registered successfully!");
    }

    // Endpoint for user login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> requestBody) {
        // Extract user credentials from request body
        String email = requestBody.get("email");
        String password = requestBody.get("password");

        // Check if the user exists in the repository by email
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid email or password"));
        }

        User user = userOptional.get();

        // Verify if the provided password matches the stored hashed password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid email or password"));
        }

        // ✅ Generate JWT Token if credentials are correct
        String token = jwtUtil.generateToken(user);

        // ✅ Return a JSON response containing the generated token
        return ResponseEntity.ok(Map.of("token", token));
    }

    // Endpoint to fetch user affiliation based on their email
    @PostMapping("/get-affiliation")
    public ResponseEntity<?> getAffiliation(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        // Check if the user exists in the repository by email
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "User not found"));
        }

        // Retrieve and return the user's affiliation
        User user = optionalUser.get();
        return ResponseEntity.ok(Map.of("success", true, "affiliation", user.getAffiliation()));
    }

}
