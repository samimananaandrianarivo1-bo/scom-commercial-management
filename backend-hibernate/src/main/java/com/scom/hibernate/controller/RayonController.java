package com.scom.hibernate.controller;

import com.scom.hibernate.dto.RayonRequest;
import com.scom.hibernate.dto.RayonResponse;
import com.scom.hibernate.service.RayonService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rayons")
@RequiredArgsConstructor
@Tag(name = "Rayons", description = "CRUD des rayons (Hibernate)")
public class RayonController {
    private final RayonService service;

    @GetMapping public List<RayonResponse> findAll() { return service.findAll(); }
    @GetMapping("/{id}") public RayonResponse findById(@PathVariable Long id) { return service.findById(id); }
    @PostMapping public ResponseEntity<RayonResponse> create(@Valid @RequestBody RayonRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(r));
    }
    @PutMapping("/{id}") public RayonResponse update(@PathVariable Long id, @Valid @RequestBody RayonRequest r) {
        return service.update(id, r);
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id); return ResponseEntity.noContent().build();
    }
}
