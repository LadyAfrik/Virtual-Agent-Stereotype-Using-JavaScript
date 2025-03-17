package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List; // Import this to resolve the List type error
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000") // Allow frontend requests
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // New endpoint to check user access
    @PostMapping("/check-access")
    public ResponseEntity<?> checkAccess(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "User not found"));
        }

        User user = optionalUser.get();

        // Assuming you have these fields in your User entity
        int watchedVideos = user.getWatchedTheVideos();
        int takenSurvey = user.getTakenTheSurvey();

        if (watchedVideos != 1) {
            return ResponseEntity.ok(Map.of("success", false, "message", "Access Denied. You must watch the videos first."));
        } else if (watchedVideos == 1 && takenSurvey != 1) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Access Granted"));
        } else if (watchedVideos == 1 && takenSurvey == 1) {
            return ResponseEntity.ok(Map.of("success", false, "message", "You have already taken this survey."));
        } else {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Access Denied, please contact the administrator on christianah_oyewale@sfu.ca"));
        }
    }

    @PostMapping("/get-affiliation")
    public ResponseEntity<?> getAffiliation(@RequestBody Map<String, String> request, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        String email = request.get("email");
        System.out.println("Received request for email: " + email);
        System.out.println("Authorization Header: " + authHeader); // ✅ Log the token

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Missing or invalid token");
        }

        // Fetch user from the database by email
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return ResponseEntity.ok(Map.of("success", true, "affiliation", user.getAffiliation()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
}
