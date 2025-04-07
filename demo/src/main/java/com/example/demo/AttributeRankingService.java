package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired; // Import for autowiring dependencies
import org.springframework.stereotype.Service; // Import for marking the class as a service

@Service // Marks this class as a service that contains business logic
public class AttributeRankingService {

    @Autowired // Automatically injects the AttributeRankingRepository dependency
    private AttributeRankingRepository attributeRankingRepository;

    // Method to save an AttributeRanking object to the database
    public void saveAttributeRanking(AttributeRanking attributeRanking) {
        attributeRankingRepository.save(attributeRanking); // Calls the save method of the repository to persist data
    }
}
