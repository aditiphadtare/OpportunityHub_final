package com.events.eventfetcher.service;

import org.springframework.stereotype.Service;

@Service
public class OpportunityFetchService {

    private final HackathonFetchService hackathonFetchService;

    public OpportunityFetchService(HackathonFetchService hackathonFetchService) {
        this.hackathonFetchService = hackathonFetchService;
    }

    public void syncHackathons() {
        hackathonFetchService.loadAllHackathons();
    }
}














