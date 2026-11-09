package com.scom.jpa.controller;

import com.scom.jpa.entity.Vendeur;
import com.scom.jpa.repository.VendeurRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Démonstration de Spring Data JPA :
 * pagination, tri, recherche full-text.
 */
@RestController
@RequestMapping("/api/vendeurs")
@RequiredArgsConstructor
@Tag(name = "Vendeurs (JPA)", description = "Recherche avancée, pagination, tri")
public class VendeurQueryController {

    private final VendeurRepository repository;

    @GetMapping
    @Operation(summary = "Lister tous les vendeurs")
    public List<Vendeur> findAll() { return repository.findAll(); }

    @GetMapping("/page")
    @Operation(summary = "Pagination + tri des vendeurs")
    public Page<Vendeur> page(@RequestParam(defaultValue = "0") int page,
                              @RequestParam(defaultValue = "10") int size,
                              @RequestParam(defaultValue = "nomVendeur") String sort,
                              @RequestParam(defaultValue = "asc") String direction) {
        Sort s = "desc".equalsIgnoreCase(direction)
                ? Sort.by(sort).descending()
                : Sort.by(sort).ascending();
        return repository.findAll(PageRequest.of(page, size, s));
    }

    @GetMapping("/search")
    @Operation(summary = "Recherche full-text (code / nom / prénom)")
    public List<Vendeur> search(@RequestParam String q) {
        return repository.search(q);
    }
}
