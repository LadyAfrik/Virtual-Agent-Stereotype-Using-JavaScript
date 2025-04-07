package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired; // Import for dependency injection of beans
import org.springframework.stereotype.Service; // Import for marking the class as a service

@Service // Marks the class as a service bean to be managed by Spring's container
public class GenderSelectionService {

    @Autowired // Injects GenderSelectionRepository dependency into this service
    private GenderSelectionRepository genderSelectionRepository;

    // Method to save a GenderSelection object using the injected repository
    public void saveGenderSelection(GenderSelection genderSelection) {
        genderSelectionRepository.save(genderSelection); // Saves the GenderSelection entity to the database
    }
}
