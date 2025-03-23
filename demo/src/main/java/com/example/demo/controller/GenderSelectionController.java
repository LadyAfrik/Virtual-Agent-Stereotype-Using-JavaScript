package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.GenderSelection;
import com.example.demo.GenderSelectionService;

@RestController
@RequestMapping("/api/survey")
public class GenderSelectionController {

    @Autowired
    private GenderSelectionService genderSelectionService;

    @PostMapping("/save-gender")
    public ResponseEntity<String> saveGenderSelection(@RequestBody GenderSelection genderSelection) {
        genderSelectionService.saveGenderSelection(genderSelection);
        return ResponseEntity.ok("Gender selection saved successfully!");
    }
}
