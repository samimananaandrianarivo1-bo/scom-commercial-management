package com.scom.jpa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * SCOM - Backend Spring Data JPA
 * ------------------------------
 * Application dédiée aux statistiques, rapports, classements
 * et recherches avancées via Spring Data JPA.
 *
 * Port: 8082
 */
@SpringBootApplication
public class ScomJpaApplication {
    public static void main(String[] args) {
        SpringApplication.run(ScomJpaApplication.class, args);
    }
}
