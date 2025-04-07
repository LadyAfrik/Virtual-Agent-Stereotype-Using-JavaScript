package com.example.demo.security; // Package for security-related classes, including JWT utility methods

import com.example.demo.User; // Import User class to access user details
import io.jsonwebtoken.*; // JWT library for handling JSON Web Tokens (JWT)
import io.jsonwebtoken.security.Keys; // Utility to generate secure keys for JWT signing
import org.springframework.security.core.userdetails.UserDetails; // Import UserDetails for comparing user info in token
import org.springframework.stereotype.Component; // Mark as a Spring component for dependency injection

import java.security.Key; // Import Key for cryptographic key handling
import java.util.Date; // Import Date for token expiration management
import java.util.function.Function; // Import Function for extracting claims from JWT

@Component // Marks this class as a Spring Bean to be managed by the Spring container
public class JwtUtil {

    private static final String SECRET_KEY = "yourSuperSecretKeyForJWTGenerationYourSuperSecretKey"; // 256-bit key used for signing the JWT
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 hours expiration time for the JWT

    // Method to get the signing key (HMAC algorithm) for JWT creation
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes()); // Generate the key from the provided secret
    }

    // Method to generate a JWT token based on a User object
    public String generateToken(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null"); // Ensure user is not null
        }

        // Create the JWT token with relevant user claims and expiration time
        return Jwts.builder()
                .setSubject(user.getEmail()) // Set the subject as the user's email
                .claim("gender", user.getGender()) // Add custom claim for gender
                .claim("age", user.getAge()) // Add custom claim for age
                .claim("levelOfStudy", user.getLevelOfStudy()) // Add custom claim for level of study
                .claim("affiliation", user.getAffiliation()) // Add custom claim for affiliation
                .setIssuedAt(new Date()) // Set the issued date
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Set expiration time
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Sign the JWT with the secret key and algorithm
                .compact(); // Return the compacted JWT string
    }

    // Method to extract the username (email) from the JWT token
    public String extractUsername(String token) {
        return extractEmail(token); // Calls extractEmail to extract the subject (email)
    }

    // Method to extract email from JWT token
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject); // Use Claims' getSubject method to get the email
    }

    // Generic method to extract claims from the JWT token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        try {
            Claims claims = Jwts.parserBuilder() // Use the JWT parser to parse the token
                    .setSigningKey(getSigningKey()) // Set the signing key for validation
                    .build()
                    .parseClaimsJws(token) // Parse the token and get the claims body
                    .getBody(); // Get the claims body
            return claimsResolver.apply(claims); // Apply the provided function (claimsResolver) to the claims
        } catch (JwtException e) {
            throw new RuntimeException("Invalid JWT Token", e); // Catch and throw if the token is invalid
        }
    }

    // Method to validate the JWT token by comparing the username and checking expiration
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token); // Extract the username from the token
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token); // Check if username matches and token is not expired
    }

    // Helper method to check if the token has expired
    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date()); // Check if token's expiration date is before current date
    }
}
