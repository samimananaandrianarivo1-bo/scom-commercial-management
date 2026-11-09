package com.scom.jpa.controller;

import com.scom.jpa.dto.DashboardStats;
import com.scom.jpa.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Agrégats globaux pour l'accueil (JPA)")
public class DashboardController {
    private final DashboardService service;

    @GetMapping
    @Operation(summary = "Statistiques globales du dashboard")
    public DashboardStats dashboard() { return service.compute(); }
}
