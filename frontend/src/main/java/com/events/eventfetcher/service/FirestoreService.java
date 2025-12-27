package com.events.eventfetcher.service;

import com.events.eventfetcher.model.Opportunity;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

@Service
public class FirestoreService {

    private final Firestore db;

    public FirestoreService() {
        this.db = FirestoreClient.getFirestore();
    }

    public void saveOpportunity(Opportunity opportunity) {
        db.collection("opportunities")
                .document(opportunity.getId())
                .set(opportunity);
    }
}





    