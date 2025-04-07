package com.example.demo;

import org.springframework.http.HttpStatus; // Import for HTTP status codes
import org.springframework.http.ResponseEntity; // Import for ResponseEntity to build HTTP responses
import org.springframework.web.bind.annotation.*; // Import for Spring MVC annotations like @RestController, @RequestMapping, etc.
import org.springframework.beans.factory.annotation.Autowired; // Import for dependency injection
import java.util.List; // Import for handling lists
import java.util.Map; // Import for handling key-value pairs (maps)
import java.util.Optional; // Import for handling optional results from repositories

@CrossOrigin(origins = "http://localhost:3000") // Allow frontend requests from localhost:3000
@RestController // Marks this class as a REST controller to handle HTTP requests
@RequestMapping("/api/users") // Sets the base URL path for all endpoints in this controller
public class UserController {

    @Autowired
    private UserRepository userRepository; // Injecting UserRepository to interact with the database

    @PostMapping // Endpoint to create a new user
    public User createUser(@RequestBody User user) {
        return userRepository.save(user); // Saves the new user to the database
    }

    @GetMapping // Endpoint to retrieve all users
    public List<User> getAllUsers() {
        return userRepository.findAll(); // Fetches all users from the database
    }

    // ✅ Check user access for survey
    @PostMapping("/check-access") // Endpoint to check if the user has access to the survey
    public ResponseEntity<?> checkAccess(@RequestBody Map<String, String> request) {
        String email = request.get("email"); // Extract email from request body

        Optional<User> optionalUser = userRepository.findByEmail(email); // Search for user by email
        if (optionalUser.isEmpty()) { // If user not found, return forbidden status
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "User not found"));
        }

        User user = optionalUser.get(); // Get the user object

        if (user.getWatchedTheVideos() != 1) { // If user has not watched the videos
            return ResponseEntity.ok(Map.of("success", false, "message", "Access Denied. You must watch all videos first."));
        }
        if (user.getTakenTheSurvey() == 1) { // If user has already taken the survey
            return ResponseEntity.ok(Map.of("success", false, "message", "You have already taken this survey."));
        }

        return ResponseEntity.ok(Map.of("success", true, "message", "Access Granted")); // Access granted
    }

    // ✅ Fetch user affiliation
    @PostMapping("/get-affiliation") // Endpoint to fetch user's affiliation
    public ResponseEntity<?> getAffiliation(@RequestBody Map<String, String> request, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        String email = request.get("email"); // Extract email from request body

        if (authHeader == null || !authHeader.startsWith("Bearer ")) { // Check if Authorization header is valid
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Missing or invalid token"); // If token is invalid, return forbidden response
        }

        Optional<User> userOpt = userRepository.findByEmail(email); // Fetch user by email
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(Map.of("success", true, "affiliation", userOpt.get().getAffiliation())); // Return user's affiliation
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"); // If user not found, return not found response
    }

    // ✅ Update video progress
    @PostMapping("/update-video-progress") // Endpoint to update video progress for a user
    public ResponseEntity<?> updateVideoProgress(@RequestBody Map<String, Object> request) {
        String email = (String) request.get("email"); // Extract email from request body
        int lastWatchedVideo = (int) request.get("lastWatchedVideo"); // Extract last watched video index

        Optional<User> userOpt = userRepository.findByEmail(email); // Search for user by email
        if (userOpt.isPresent()) {
            User user = userOpt.get(); // Get the user object
            user.setLastWatchedVideo(lastWatchedVideo); // Update the last watched video index

            // ✅ Mark videos as watched when all are completed
            if (lastWatchedVideo >= 2) { // If user has watched all videos
                user.setWatchedTheVideos(1); // Mark videos as watched
            }

            userRepository.save(user); // Save the updated user to the database
            return ResponseEntity.ok(Map.of("success", true, "message", "Video progress updated"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "User not found"));
    }

    // ✅ Restart video progress
    @PostMapping("/restart-videos") // Endpoint to reset the video progress for a user
    public ResponseEntity<?> restartVideos(@RequestBody Map<String, String> request) {
        String email = request.get("email"); // Extract email from request body

        Optional<User> userOpt = userRepository.findByEmail(email); // Search for user by email
        if (userOpt.isPresent()) {
            User user = userOpt.get(); // Get the user object
            user.setLastWatchedVideo(0); // Reset the last watched video index
            user.setWatchedTheVideos(0); // Reset the watched videos flag
            userRepository.save(user); // Save the updated user to the database
            return ResponseEntity.ok(Map.of("success", true, "message", "Video progress reset"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "User not found"));
    }

    // ✅ Fetch user video progress
    @GetMapping("/check-progress/{email}") // Endpoint to check video progress by email
    public ResponseEntity<?> checkVideoProgress(@PathVariable String email) {
        Optional<User> userOpt = userRepository.findByEmail(email); // Fetch user by email
        if (userOpt.isPresent()) {
            User user = userOpt.get(); // Get the user object
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "lastWatchedVideo", user.getLastWatchedVideo(), // Return last watched video index
                    "watchedTheVideos", user.getWatchedTheVideos() // Return watched videos flag
            ));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "User not found")); // If user not found, return not found response
    }

}
