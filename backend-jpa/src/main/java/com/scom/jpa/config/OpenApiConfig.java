package com.scom.jpa.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI scomJpaOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("SCOM - Backend JPA API")
                .description("API REST du système SCOM (statistiques, rapports, classements).")
                .version("1.0.0")
                .contact(new Contact().name("SCOM Team").email("scom@example.local"))
                .license(new License().name("Academic Use")));
    }
}
