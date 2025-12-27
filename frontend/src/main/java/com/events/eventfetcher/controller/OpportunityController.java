package com.events.eventfetcher.controller;

import com.events.eventfetcher.service.EventFetchService;
import com.events.eventfetcher.service.HackathonFetchService;
import com.events.eventfetcher.service.InternshipFetchService;
import com.events.eventfetcher.service.JobFetchService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class OpportunityController {

    private final HackathonFetchService hackathonFetchService;
    private final EventFetchService eventFetchService;
    private final InternshipFetchService internshipFetchService;
    private final JobFetchService jobFetchService;

    public OpportunityController(
            HackathonFetchService hackathonFetchService,
            EventFetchService eventFetchService,
            InternshipFetchService internshipFetchService,
            JobFetchService jobFetchService
    ) {
        this.hackathonFetchService = hackathonFetchService;
        this.eventFetchService = eventFetchService;
        this.internshipFetchService = internshipFetchService;
        this.jobFetchService = jobFetchService;
    }

    @GetMapping("/sync-hackathons")
    public String syncHackathons() {
        hackathonFetchService.loadAllHackathons();
        return "Hackathons synced!";
    }

    @GetMapping("/sync-events")
    public String syncEvents() {
        eventFetchService.loadAllEvents();
        return "Events synced!";
    }

    @GetMapping("/sync-internships")
    public String syncInternships() {
        internshipFetchService.loadAllInternships();
        return "Internships synced!";
    }

    @GetMapping("/sync-jobs")
    public String syncJobs() {
        jobFetchService.loadAllJobs();
        return "Jobs synced!";
    }
}












