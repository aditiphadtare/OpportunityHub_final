package com.events.eventfetcher.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true) // ✅ prevents crashes from extra JSON fields
public class Opportunity {

    private String id;
    private String title;
    private String organization;
    private String type;
    private String location;

    // ✅ JSON uses "isRemote"
    @JsonProperty("isRemote")
    private boolean isRemote;

    private String deadline;
    private List<String> domains;
    private List<String> skills;
    private String description;

    private String stipend;   // internships / jobs
    private String reward;    // hackathons
    private String duration;  // internships

    private String source;
    private String createdAt;

    // ✅ REQUIRED by Jackson
    public Opportunity() {}

    // ---------- GETTERS & SETTERS ----------

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getOrganization() { return organization; }
    public void setOrganization(String organization) { this.organization = organization; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    // ✅ Boolean getter MUST be isX()
    public boolean isRemote() {
        return isRemote;
    }

    public void setRemote(boolean remote) {
        this.isRemote = remote;
    }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public List<String> getDomains() { return domains; }
    public void setDomains(List<String> domains) { this.domains = domains; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStipend() { return stipend; }
    public void setStipend(String stipend) { this.stipend = stipend; }

    public String getReward() { return reward; }
    public void setReward(String reward) { this.reward = reward; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}








