package com.example.demo.security; // Package containing security-related classes

// Import necessary classes from Spring Security and the User model
import com.example.demo.User; // The User entity/model class
import com.example.demo.UserRepository; // Repository for querying the User data
import org.springframework.security.core.userdetails.UserDetails; // Interface for user details used by Spring Security
import org.springframework.security.core.userdetails.UserDetailsService; // Interface for loading user details by username
import org.springframework.security.core.userdetails.UsernameNotFoundException; // Exception thrown when a user is not found
import org.springframework.stereotype.Service; // Annotation for Spring-managed service class

import java.util.Optional; // Importing Optional to handle values that may or may not be present.

// Service class that implements UserDetailsService to load user details for authentication
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository; // Repository to interact with the database

    // Constructor-based dependency injection for UserRepository
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository; // Initialize the userRepository field
    }

    // This method is called by Spring Security to load user details for authentication by email
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Attempt to find the user in the database by email
        Optional<User> user = userRepository.findByEmail(email);

        // If the user exists, map the User object to a CustomUserDetails object
        // If the user is not found, throw an exception indicating that the user was not found
        return user.map(CustomUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}