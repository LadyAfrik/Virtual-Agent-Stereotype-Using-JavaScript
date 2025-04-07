package com.example.demo.security;

import org.springframework.context.annotation.Bean; // Import to define beans in the context
import org.springframework.context.annotation.Configuration; // Mark the class as a configuration class
import org.springframework.security.authentication.AuthenticationManager; // Import for authentication manager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider; // Import for DAO-based authentication provider
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration; // Import for authentication configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity; // Import to configure HTTP security settings
import org.springframework.security.config.http.SessionCreationPolicy; // Import for session management policy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Import for bcrypt password encoding
import org.springframework.security.crypto.password.PasswordEncoder; // Import to define the password encoder bean
import org.springframework.security.web.SecurityFilterChain; // Import to configure security filter chain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // Import to add custom authentication filter
import org.springframework.security.core.userdetails.UserDetailsService; // Import for user details service
import org.springframework.web.cors.CorsConfiguration; // Import for CORS configuration
import org.springframework.web.cors.CorsConfigurationSource; // Import for CORS configuration source
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // Import for URL-based CORS configuration
import org.springframework.beans.factory.annotation.Autowired; // Import for dependency injection

import java.util.List; // Import for list utility

@Configuration // Marks the class as a configuration class for Spring to process
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter; // Inject custom JWT authentication filter

    @Autowired
    private UserDetailsService userDetailsService; // Inject the user details service for authentication

    // Bean to configure the security filter chain for HTTP requests
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS with custom configuration
                .csrf(csrf -> csrf.disable())  // Disable CSRF protection for APIs, as it is not needed for stateless APIs
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll() // ✅ Allow all requests to authentication endpoints
                        .requestMatchers("/api/users/get-affiliation").authenticated() // ✅ Protect specific route, requires authentication
                        .anyRequest().authenticated() // ✅ All other routes must be authenticated
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless session management (no server-side session)
                .authenticationProvider(authenticationProvider()) // Use the custom authentication provider
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // Add JWT filter before default authentication filter

        return http.build(); // Return the configured security filter chain
    }

    // Bean to configure CORS (Cross-Origin Resource Sharing) settings
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // ✅ Allow frontend (React) from localhost:3000
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // ✅ Allow these HTTP methods
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type")); // ✅ Allow Authorization header for token and Content-Type
        configuration.setExposedHeaders(List.of("Authorization")); // ✅ Expose Authorization header to frontend
        configuration.setAllowCredentials(true); // ✅ Allow credentials to be included in CORS requests

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply the CORS configuration to all URLs
        return source; // Return the configured CORS source
    }

    // Bean to define password encoder (bcrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Use BCrypt to hash passwords securely
    }

    // Bean to configure authentication manager from Spring Security
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager(); // Get the authentication manager from the provided configuration
    }

    // Bean to configure authentication provider using DAO (Data Access Object)
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); // Use the injected user details service for authentication
        authProvider.setPasswordEncoder(passwordEncoder()); // Set the password encoder to bcrypt
        return authProvider; // Return the configured authentication provider
    }
}
