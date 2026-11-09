package com.scom.hibernate.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI scomOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("SCOM - Backend Hibernate API")
                .description("API REST du système de gestion commerciale SCOM (couche Hibernate).")
                .version("1.0.0")
                .contact(new Contact().name("SCOM Team").email("scom@example.local"))
                .license(new License().name("Academic Use")));
    }
}
