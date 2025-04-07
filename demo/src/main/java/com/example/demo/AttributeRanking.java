package com.example.demo;

import jakarta.persistence.*; // Import JPA annotations for database entity management
import com.fasterxml.jackson.annotation.JsonProperty; // Import to customize JSON serialization and deserialization
import lombok.Getter; // Import Lombok annotation for getter methods
import lombok.Setter; // Import Lombok annotation for setter methods
import java.time.LocalDateTime; // Import for working with date and time

@Getter // Lombok annotation to generate getter methods
@Setter // Lombok annotation to generate setter methods
@Entity // JPA annotation to mark this class as a persistent entity
@Table(name = "attribute_rankings") // Specifies the table name in the database for this entity
public class AttributeRanking {

    @Id // JPA annotation to mark this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // JPA annotation to automatically generate ID values
    private Long id; // Primary key for this entity

    @JsonProperty("userEmail") // ✅ Ensures correct JSON mapping to the 'userEmail' property
    @Column(name = "user_email", nullable = false) // JPA annotation to define the column name and constraints
    private String userEmail; // User's email associated with the ranking

    @JsonProperty("agentName") // Customizes the JSON property name during serialization
    @Column(name = "agent_name", nullable = false) // Defines the 'agent_name' column in the table
    private String agentName; // Name of the agent associated with the ranking

    @JsonProperty("attribute") // Maps the 'attribute' field to a JSON property
    @Column(name = "attribute", nullable = false) // Specifies the column name in the database
    private String attribute; // Attribute being ranked

    @JsonProperty("category") // Maps the 'category' field to a JSON property
    @Column(name = "category", nullable = false) // Specifies the column name in the database
    private String category; // Category to which the attribute belongs

    @JsonProperty("ranking") // Maps the 'ranking' field to a JSON property
    @Column(name = "ranking", nullable = false) // Specifies the column name in the database
    private int ranking; // Ranking value for the attribute

    @Column(name = "created_at", updatable = false) // Specifies a column for the creation timestamp
    private LocalDateTime createdAt; // Timestamp indicating when the ranking entry was created

    @PrePersist // JPA lifecycle callback that triggers before the entity is persisted
    protected void onCreate() {
        this.createdAt = LocalDateTime.now(); // ✅ Automatically set 'createdAt' timestamp before insertion
    }
}
