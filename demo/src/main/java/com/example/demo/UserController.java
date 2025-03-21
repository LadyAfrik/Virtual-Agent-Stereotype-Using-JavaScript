package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
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

    // ✅ Check user access for survey
    @PostMapping("/check-access")
    public ResponseEntity<?> checkAccess(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "User not found"));
        }

        User user = optionalUser.get();

        if (user.getWatchedTheVideos() != 1) {
            return ResponseEntity.ok(Map.of("success", false, "message", "Access Denied. You must watch all videos first."));
        }
        if (user.getTakenTheSurvey() == 1) {
            return ResponseEntity.ok(Map.of("success", false, "message", "You have already taken this survey."));
        }

        return ResponseEntity.ok(Map.of("success", true, "message", "Access Granted"));
    }

    // ✅ Fetch user affiliation
    @PostMapping("/get-affiliation")
    public ResponseEntity<?> getAffiliation(@RequestBody Map<String, String> request, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        String email = request.get("email");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Missing or invalid token");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(Map.of("success", true, "affiliation", userOpt.get().getAffiliation()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    // ✅ Update video progress
    @PostMapping("/update-video-progress")
    public ResponseEntity<?> updateVideoProgress(@RequestBody Map<String, Object> request) {
        String email = (String) request.get("email");
        int lastWatchedVideo = (int) request.get("lastWatchedVideo");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setLastWatchedVideo(lastWatchedVideo);

            // ✅ Mark videos as watched when all are completed
            if (lastWatchedVideo >= 2) {
                user.setWatchedTheVideos(1);
            }

            userRepository.save(user);
            return ResponseEntity.ok(Map.of("success", true, "message", "Video progress updated"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "User not found"));
    }

    // ✅ Restart video progress
    @PostMapping("/restart-videos")
    public ResponseEntity<?> restartVideos(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setLastWatchedVideo(0);
            user.setWatchedTheVideos(0);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("success", true, "message", "Video progress reset"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "User not found"));
    }

    // ✅ Fetch user video progress
    @GetMapping("/check-progress/{email}")
    public ResponseEntity<?> checkVideoProgress(@PathVariable String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "lastWatchedVideo", user.getLastWatchedVideo(),
                    "watchedTheVideos", user.getWatchedTheVideos()
            ));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "User not found"));
    }

}
