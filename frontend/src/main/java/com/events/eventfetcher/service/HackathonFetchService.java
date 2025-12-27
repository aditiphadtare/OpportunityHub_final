package com.events.eventfetcher.service;

import com.events.eventfetcher.model.Opportunity;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;

@Service
public class HackathonFetchService {

    private final FirestoreService firestoreService;

    public HackathonFetchService(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    // Load ALL hackathon data
    public void loadAllHackathons() {
        loadFromFile("data/hackathons.json");
    }

    private void loadFromFile(String path) {
        try {
            ObjectMapper mapper = new ObjectMapper();

            InputStream is = getClass()
                    .getClassLoader()
                    .getResourceAsStream(path);

            if (is == null) {
                System.out.println("❌ File not found: " + path);
                return;
            }

            List<Opportunity> list =
                    mapper.readValue(is, new TypeReference<List<Opportunity>>() {});

            list.forEach(firestoreService::saveOpportunity);

            System.out.println("✅ Loaded INTERNSHIPS: " + path + " | Count: " + list.size());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}