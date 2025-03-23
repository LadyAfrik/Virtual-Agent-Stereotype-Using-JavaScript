package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GenderSelectionService {

    @Autowired
    private GenderSelectionRepository genderSelectionRepository;

    public void saveGenderSelection(GenderSelection genderSelection) {
        genderSelectionRepository.save(genderSelection);
    }
}
