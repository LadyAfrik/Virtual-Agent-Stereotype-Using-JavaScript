package com.example.demo;

import jakarta.persistence.*; // Import for JPA annotations
import java.time.LocalDateTime; // Import for LocalDateTime type to store the creation timestamp

@Entity // Marks the class as a JPA entity, to be mapped to a database table
@Table(name = "gender_selections") // Specifies the name of the table in the database
public class GenderSelection {

    @Id // Marks this field as the primary key of the entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Automatically generates the ID value for new entities
    private Long id;

    @Column(name = "user_email", nullable = false) // Specifies the column for user email and ensures it cannot be null
    private String userEmail;

    @Column(name = "agent_name", nullable = false) // Specifies the column for the agent's name and ensures it cannot be null
    private String agentName;

    @Column(name = "selected_gender", nullable = false) // Specifies the column for the selected gender and ensures it cannot be null
    private String selectedGender;

    @Column(name = "created_at", updatable = false) // Specifies the creation timestamp column and prevents updating it after the record is created
    private LocalDateTime createdAt = LocalDateTime.now(); // Sets the creation timestamp to the current time

    // Default constructor (required for deserialization)
    public GenderSelection() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getAgentName() { return agentName; }
    public void setAgentName(String agentName) { this.agentName = agentName; }

    public String getSelectedGender() { return selectedGender; }
    public void setSelectedGender(String selectedGender) { this.selectedGender = selectedGender; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
