package com.scom.jpa.controller;

import com.scom.jpa.dto.RayonStat;
import com.scom.jpa.dto.VendeurClassement;
import com.scom.jpa.service.StatistiqueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statistiques")
@RequiredArgsConstructor
@Tag(name = "Statistiques", description = "Rapports & classements (JPA)")
public class StatistiqueController {
    private final StatistiqueService service;

    @GetMapping("/classement-vendeurs")
    @Operation(summary = "Classement des vendeurs par ventes")
    public List<VendeurClassement> classementVendeurs() { return service.classementVendeurs(); }

    @GetMapping("/rayons")
    @Operation(summary = "Statistiques par rayon")
    public List<RayonStat> statsRayons() { return service.statistiquesRayons(); }
}
