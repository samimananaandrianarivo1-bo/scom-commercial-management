package com.scom.hibernate.service.impl;

import com.scom.hibernate.dto.PaiementRequest;
import com.scom.hibernate.dto.PaiementResponse;
import com.scom.hibernate.entity.Paiement;
import com.scom.hibernate.exception.ConflictException;
import com.scom.hibernate.exception.ResourceNotFoundException;
import com.scom.hibernate.mapper.PaiementMapper;
import com.scom.hibernate.repository.PaiementRepository;
import com.scom.hibernate.service.PaiementService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaiementServiceImpl implements PaiementService {

    private final PaiementRepository repository;
    private final PaiementMapper mapper;

    @Override @Transactional(readOnly = true)
    public List<PaiementResponse> findAll() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override @Transactional(readOnly = true)
    public PaiementResponse findById(Long id) {
        return mapper.toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paiement", id)));
    }

    @Override @Transactional
    public PaiementResponse create(PaiementRequest req) {
        if (repository.existsById(req.idPaiement()))
            throw new ConflictException("Paiement ID " + req.idPaiement() + " déjà présent");
        return mapper.toResponse(repository.save(mapper.toEntity(req)));
    }

    @Override @Transactional
    public PaiementResponse update(Long id, PaiementRequest req) {
        Paiement p = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paiement", id));
        mapper.update(p, req);
        return mapper.toResponse(repository.save(p));
    }

    @Override @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id))
            throw new ResourceNotFoundException("Paiement", id);
        repository.deleteById(id);
    }
}
