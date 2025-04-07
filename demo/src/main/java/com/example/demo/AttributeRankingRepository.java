package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository; // Import JpaRepository interface for easy database operations

// Repository interface for managing AttributeRanking entities in the database
public interface AttributeRankingRepository extends JpaRepository<AttributeRanking, Long> {
    // Inherits common CRUD operations from JpaRepository
    // JpaRepository already provides methods like save(), findById(), findAll(), deleteById(), etc.
}
