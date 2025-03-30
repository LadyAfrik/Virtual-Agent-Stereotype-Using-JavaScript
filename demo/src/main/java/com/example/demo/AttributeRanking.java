package com.example.demo;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "attribute_rankings")
public class AttributeRanking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("userEmail") // ✅ Ensures correct JSON mapping
    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @JsonProperty("agentName")
    @Column(name = "agent_name", nullable = false)
    private String agentName;

    @JsonProperty("attribute")
    @Column(name = "attribute", nullable = false)
    private String attribute;

    @JsonProperty("category")
    @Column(name = "category", nullable = false)
    private String category;

    @JsonProperty("ranking")
    @Column(name = "ranking", nullable = false)
    private int ranking;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now(); // ✅ Automatically set when inserting
    }
}