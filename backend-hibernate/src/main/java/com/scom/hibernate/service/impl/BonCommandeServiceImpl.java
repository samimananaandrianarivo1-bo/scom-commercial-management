package com.scom.hibernate.service.impl;

import com.scom.hibernate.dto.BonCommandeRequest;
import com.scom.hibernate.dto.BonCommandeResponse;
import com.scom.hibernate.entity.BonCommande;
import com.scom.hibernate.entity.Vendeur;
import com.scom.hibernate.exception.ConflictException;
import com.scom.hibernate.exception.ResourceNotFoundException;
import com.scom.hibernate.mapper.BonCommandeMapper;
import com.scom.hibernate.repository.BonCommandeRepository;
import com.scom.hibernate.repository.VendeurRepository;
import com.scom.hibernate.service.BonCommandeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BonCommandeServiceImpl implements BonCommandeService {

    private final BonCommandeRepository repository;
    private final VendeurRepository vendeurRepository;
    private final BonCommandeMapper mapper;

    private Vendeur resolveVendeur(Long id) {
        if (id == null) return null;
        return vendeurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendeur", id));
    }

    @Override @Transactional(readOnly = true)
    public List<BonCommandeResponse> findAll() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override @Transactional(readOnly = true)
    public BonCommandeResponse findById(Long id) {
        return mapper.toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BonCommande", id)));
    }

    @Override @Transactional
    public BonCommandeResponse create(BonCommandeRequest req) {
        if (repository.existsById(req.idBonCommande()))
            throw new ConflictException("Bon de commande ID " + req.idBonCommande() + " déjà présent");
        return mapper.toResponse(repository.save(mapper.toEntity(req, resolveVendeur(req.idVendeur()))));
    }

    @Override @Transactional
    public BonCommandeResponse update(Long id, BonCommandeRequest req) {
        BonCommande b = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BonCommande", id));
        mapper.update(b, req, resolveVendeur(req.idVendeur()));
        return mapper.toResponse(repository.save(b));
    }

    @Override @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id))
            throw new ResourceNotFoundException("BonCommande", id);
        repository.deleteById(id);
    }
}
