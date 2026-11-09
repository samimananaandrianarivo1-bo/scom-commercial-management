package com.scom.hibernate.controller;

import com.scom.hibernate.dto.BonCommandeRequest;
import com.scom.hibernate.dto.BonCommandeResponse;
import com.scom.hibernate.service.BonCommandeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bons-commandes")
@RequiredArgsConstructor
@Tag(name = "Bons de commande", description = "CRUD des bons de commande (Hibernate)")
public class BonCommandeController {
    private final BonCommandeService service;

    @GetMapping public List<BonCommandeResponse> findAll() { return service.findAll(); }
    @GetMapping("/{id}") public BonCommandeResponse findById(@PathVariable Long id) { return service.findById(id); }
    @PostMapping public ResponseEntity<BonCommandeResponse> create(@Valid @RequestBody BonCommandeRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(r));
    }
    @PutMapping("/{id}") public BonCommandeResponse update(@PathVariable Long id, @Valid @RequestBody BonCommandeRequest r) {
        return service.update(id, r);
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id); return ResponseEntity.noContent().build();
    }
}
