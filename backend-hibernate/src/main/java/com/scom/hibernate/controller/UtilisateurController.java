package com.scom.hibernate.controller;

import com.scom.hibernate.dto.LoginRequest;
import com.scom.hibernate.dto.UtilisateurRequest;
import com.scom.hibernate.dto.UtilisateurResponse;
import com.scom.hibernate.service.UtilisateurService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
@Tag(name = "Utilisateurs", description = "CRUD des utilisateurs (Hibernate)")
public class UtilisateurController {
    private final UtilisateurService service;

    @GetMapping public List<UtilisateurResponse> findAll() { return service.findAll(); }
    @GetMapping("/{id}") public UtilisateurResponse findById(@PathVariable Long id) { return service.findById(id); }
    @PostMapping public ResponseEntity<UtilisateurResponse> create(@Valid @RequestBody UtilisateurRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(r));
    }
    @PutMapping("/{id}") public UtilisateurResponse update(@PathVariable Long id, @Valid @RequestBody UtilisateurRequest r) {
        return service.update(id, r);
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id); return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public UtilisateurResponse login(@Valid @RequestBody LoginRequest req) {
        return service.authenticate(req);
    }

    @PutMapping("/{id}/photo")
    public UtilisateurResponse updatePhoto(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        return service.updatePhoto(id, body.get("photo"));
    }
}
