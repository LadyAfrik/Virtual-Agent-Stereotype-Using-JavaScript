package com.example.demo.controller;

import com.example.demo.User;
import com.example.demo.UserRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder; // Updated to PasswordEncoder

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String password = requestBody.get("password");
        String confirmPassword = requestBody.get("confirmPassword");
        String gender = requestBody.get("gender");
        int age;

        try {
            age = Integer.parseInt(requestBody.get("age"));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Error: Invalid age format.");
        }

        String levelOfStudy = requestBody.get("levelOfStudy");
        String affiliation = requestBody.get("affiliation");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email already in use");
        }

        if (!password.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body("Error: Passwords do not match");
        }

        User user = new User(email, gender, age, levelOfStudy, affiliation, passwordEncoder.encode(password), 0, 0, 0);
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String password = requestBody.get("password");

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid email or password"));
        }

        User user = userOptional.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid email or password"));
        }

        // ✅ Generate JWT Token
        String token = jwtUtil.generateToken(user);

        // ✅ Return JSON response instead of plain text
        return ResponseEntity.ok(Map.of("token", token));
    }


    @PostMapping("/get-affiliation")
    public ResponseEntity<?> getAffiliation(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "User not found"));
        }

        User user = optionalUser.get();
        return ResponseEntity.ok(Map.of("success", true, "affiliation", user.getAffiliation()));
    }

}