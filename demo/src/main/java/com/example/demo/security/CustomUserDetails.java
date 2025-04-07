package com.example.demo.security; // Package for security-related classes

// Import necessary Spring Security classes and the User model
import com.example.demo.User; // User model class representing a user in the application
import org.springframework.security.core.GrantedAuthority; // Represents a granted authority (role or permission) in Spring Security
import org.springframework.security.core.userdetails.UserDetails; // Interface for user details in Spring Security

import java.util.Collection; // Collection class for managing a group of authorities
import java.util.Collections; // Utility class for creating empty collections

// Custom implementation of UserDetails to integrate with Spring Security's authentication system
public class CustomUserDetails implements UserDetails {

    private final User user; // The actual User object that holds the user's data

    // Constructor to initialize with a User object
    public CustomUserDetails(User user) {
        this.user = user;
    }

    // Returns the authorities granted to the user (roles, permissions), in this case, there are no authorities (empty list)
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList(); // No roles or authorities are being used here
    }

    // Returns the password of the user (used for authentication)
    @Override
    public String getPassword() {
        return user.getPassword(); // Get the password from the User object
    }

    // Returns the username (email) of the user (used for authentication)
    @Override
    public String getUsername() {
        return user.getEmail(); // Get the email of the user as the username
    }

    // Additional getter methods to expose other user-related properties
    public String getGender() {
        return user.getGender(); // Get the gender of the user
    }

    public int getAge() {
        return user.getAge(); // Get the age of the user
    }

    public String getLevelOfStudy() {
        return user.getLevelOfStudy(); // Get the level of study of the user
    }

    public String getAffiliation() {
        return user.getAffiliation(); // Get the affiliation of the user
    }

    // These methods are part of the UserDetails interface and are used to define the account status

    // Check if the account has expired (always returns true in this case)
    @Override
    public boolean isAccountNonExpired() {
        return true; // This example assumes the account does not expire
    }

    // Check if the account is locked (always returns true in this case)
    @Override
    public boolean isAccountNonLocked() {
        return true; // This example assumes the account is not locked
    }

    // Check if the credentials (password) have expired (always returns true in this case)
    @Override
    public boolean isCredentialsNonExpired() {
        return true; // This example assumes credentials do not expire
    }

    // Check if the account is enabled (always returns true in this case)
    @Override
    public boolean isEnabled() {
        return true; // This example assumes the account is always enabled
    }
}
