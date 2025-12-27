package com.events.eventfetcher;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class EventfetcherApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventfetcherApplication.class, args);
    }
}
