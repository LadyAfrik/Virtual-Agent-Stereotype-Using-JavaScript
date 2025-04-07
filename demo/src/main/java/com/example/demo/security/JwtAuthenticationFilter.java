package com.example.demo.security; // Package containing security-related classes for the demo application

// Importing necessary classes for filter chain and request-response handling
import jakarta.servlet.FilterChain; // Handles the filter chain for HTTP requests
import jakarta.servlet.ServletException; // Thrown when a servlet encounters a general exception
import jakarta.servlet.http.HttpServletRequest; // Represents the HTTP request object
import jakarta.servlet.http.HttpServletResponse; // Represents the HTTP response object

// Importing Spring Security classes for user authentication and security context
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // Represents the authentication token with username and password
import org.springframework.security.core.context.SecurityContextHolder; // Holds the security context for the current request
import org.springframework.security.core.userdetails.UserDetails; // Represents the details of a user in Spring Security
import org.springframework.security.core.userdetails.UserDetailsService; // Service interface for loading user details by username
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource; // Used for handling details about the web authentication (e.g., IP, session)
import org.springframework.stereotype.Component; // Marks the class as a Spring component
import org.springframework.web.filter.OncePerRequestFilter; // Base class to create filters that execute once per request

import java.io.IOException; // Handles input-output exceptions


// This filter is responsible for extracting and validating JWT tokens for authentication
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil; // Utility class for handling JWT operations
    private final UserDetailsService userDetailsService; // Service to load user details from the database

    // Constructor injection to provide dependencies
    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    // Method to filter HTTP requests and authenticate the user based on the JWT token
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        try {
            // Extract the "Authorization" header from the request
            String authHeader = request.getHeader("Authorization");

            // If no Authorization header or it doesn't start with "Bearer ", move to the next filter
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            // Extract the token from the Authorization header (after "Bearer ")
            String token = authHeader.substring(7);

            // Extract the username from the token
            String username = jwtUtil.extractUsername(token);

            // If the username exists and there is no authentication in the current context
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Load user details from the database
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // Validate the token
                if (jwtUtil.validateToken(token, userDetails)) {
                    // Create an authentication token for the authenticated user
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    // Set additional details (like IP address) into the authentication object
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Set the authentication in the SecurityContextHolder
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            // Log any exceptions that occur during the authentication process
            logger.error("JWT Authentication failed: " + e.getMessage(), e);
        }

        // Continue with the next filter in the chain (if any)
        filterChain.doFilter(request, response);
    }
}
