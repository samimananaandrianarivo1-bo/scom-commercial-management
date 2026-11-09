package com.scom.hibernate.service.impl;

import com.scom.hibernate.dto.CommissionRequest;
import com.scom.hibernate.dto.CommissionResponse;
import com.scom.hibernate.entity.Commission;
import com.scom.hibernate.entity.Vendeur;
import com.scom.hibernate.exception.ConflictException;
import com.scom.hibernate.exception.ResourceNotFoundException;
import com.scom.hibernate.mapper.CommissionMapper;
import com.scom.hibernate.repository.CommissionRepository;
import com.scom.hibernate.repository.VendeurRepository;
import com.scom.hibernate.service.CommissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommissionServiceImpl implements CommissionService {

    private final CommissionRepository repository;
    private final VendeurRepository vendeurRepository;
    private final CommissionMapper mapper;

    private Vendeur resolveVendeur(Long id) {
        if (id == null) return null;
        return vendeurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendeur", id));
    }

    @Override @Transactional(readOnly = true)
    public List<CommissionResponse> findAll() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override @Transactional(readOnly = true)
    public CommissionResponse findById(Long id) {
        return mapper.toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commission", id)));
    }

    @Override @Transactional
    public CommissionResponse create(CommissionRequest req) {
        if (repository.existsById(req.idCommission()))
            throw new ConflictException("Commission ID " + req.idCommission() + " déjà présente");
        return mapper.toResponse(repository.save(mapper.toEntity(req, resolveVendeur(req.idVendeur()))));
    }

    @Override @Transactional
    public CommissionResponse update(Long id, CommissionRequest req) {
        Commission c = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commission", id));
        mapper.update(c, req, resolveVendeur(req.idVendeur()));
        return mapper.toResponse(repository.save(c));
    }

    @Override @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id))
            throw new ResourceNotFoundException("Commission", id);
        repository.deleteById(id);
    }
}
