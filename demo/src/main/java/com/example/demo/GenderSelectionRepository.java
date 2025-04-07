package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository; // Import for JpaRepository, a Spring Data interface for CRUD operations

// GenderSelectionRepository interface for performing CRUD operations on GenderSelection entities
public interface GenderSelectionRepository extends JpaRepository<GenderSelection, Long> {
    // JpaRepository provides basic CRUD functionality like save(), findAll(), findById(), deleteById(), etc.
    // The GenderSelection entity and Long are passed as generic types for entity class and its ID type
}
