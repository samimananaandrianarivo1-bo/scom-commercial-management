package com.scom.hibernate.controller;

import com.scom.hibernate.dto.CommissionRequest;
import com.scom.hibernate.dto.CommissionResponse;
import com.scom.hibernate.service.CommissionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/commissions")
@RequiredArgsConstructor
@Tag(name = "Commissions", description = "CRUD des commissions (Hibernate)")
public class CommissionController {
    private final CommissionService service;

    @GetMapping public List<CommissionResponse> findAll() { return service.findAll(); }
    @GetMapping("/{id}") public CommissionResponse findById(@PathVariable Long id) { return service.findById(id); }
    @PostMapping public ResponseEntity<CommissionResponse> create(@Valid @RequestBody CommissionRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(r));
    }
    @PutMapping("/{id}") public CommissionResponse update(@PathVariable Long id, @Valid @RequestBody CommissionRequest r) {
        return service.update(id, r);
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id); return ResponseEntity.noContent().build();
    }
}
