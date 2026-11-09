package com.scom.hibernate.controller;

import com.scom.hibernate.dto.PaiementRequest;
import com.scom.hibernate.dto.PaiementResponse;
import com.scom.hibernate.service.PaiementService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/paiements")
@RequiredArgsConstructor
@Tag(name = "Paiements", description = "CRUD des paiements (Hibernate)")
public class PaiementController {
    private final PaiementService service;

    @GetMapping public List<PaiementResponse> findAll() { return service.findAll(); }
    @GetMapping("/{id}") public PaiementResponse findById(@PathVariable Long id) { return service.findById(id); }
    @PostMapping public ResponseEntity<PaiementResponse> create(@Valid @RequestBody PaiementRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(r));
    }
    @PutMapping("/{id}") public PaiementResponse update(@PathVariable Long id, @Valid @RequestBody PaiementRequest r) {
        return service.update(id, r);
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id); return ResponseEntity.noContent().build();
    }
}
