package com.scom.hibernate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * SCOM - Backend Hibernate
 * ------------------------
 * Spring Boot application dedicated to CRUD operations
 * (Vendeurs, Rayons, Bons de Commande, Commissions,
 * Paiements, Utilisateurs) via Hibernate ORM.
 *
 * Port: 8081
 */
@SpringBootApplication
public class ScomHibernateApplication {

    public static void main(String[] args) {
        SpringApplication.run(ScomHibernateApplication.class, args);
    }
}
