package com.example.demo; // Keep this consistent with User.java

import org.springframework.data.jpa.repository.JpaRepository; // Importing JpaRepository to access common database operations
import org.springframework.stereotype.Repository; // Marking this interface as a Spring Data repository

import java.util.Optional; // Importing Optional to handle null-safe return values

@Repository // Marks this interface as a Spring Data JPA repository
public interface UserRepository extends JpaRepository<User, Long> { // Extends JpaRepository to provide CRUD operations for the User entity
    // Custom query method to find a User by their email
    Optional<User> findByEmail(String email); // Returns an Optional User based on the email provided
}
