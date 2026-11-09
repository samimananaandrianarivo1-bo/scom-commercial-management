package com.scom.hibernate.controller;

import com.scom.hibernate.dto.VendeurRequest;
import com.scom.hibernate.dto.VendeurResponse;
import com.scom.hibernate.service.VendeurService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendeurs")
@RequiredArgsConstructor
@Tag(name = "Vendeurs", description = "CRUD des vendeurs (Hibernate)")
public class VendeurController {

    private final VendeurService service;

    @GetMapping
    @Operation(summary = "Lister tous les vendeurs")
    public List<VendeurResponse> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    @Operation(summary = "Détail d'un vendeur")
    public VendeurResponse findById(@PathVariable Long id) { return service.findById(id); }

    @PostMapping
    @Operation(summary = "Créer un vendeur")
    public ResponseEntity<VendeurResponse> create(@Valid @RequestBody VendeurRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un vendeur")
    public VendeurResponse update(@PathVariable Long id, @Valid @RequestBody VendeurRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un vendeur")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
