package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AttributeRankingService {

    @Autowired
    private AttributeRankingRepository attributeRankingRepository;

    public void saveAttributeRanking(AttributeRanking attributeRanking) {
        attributeRankingRepository.save(attributeRanking);
    }
}
