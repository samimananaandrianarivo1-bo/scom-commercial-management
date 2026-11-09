package com.scom.hibernate.service.impl;

import com.scom.hibernate.dto.VendeurRequest;
import com.scom.hibernate.dto.VendeurResponse;
import com.scom.hibernate.entity.Vendeur;
import com.scom.hibernate.exception.ConflictException;
import com.scom.hibernate.exception.ResourceNotFoundException;
import com.scom.hibernate.mapper.VendeurMapper;
import com.scom.hibernate.repository.VendeurRepository;
import com.scom.hibernate.service.VendeurService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendeurServiceImpl implements VendeurService {

    private final VendeurRepository repository;
    private final VendeurMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<VendeurResponse> findAll() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public VendeurResponse findById(Long id) {
        return mapper.toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendeur", id)));
    }

    @Override
    @Transactional
    public VendeurResponse create(VendeurRequest req) {
        if (repository.existsById(req.idVendeur()))
            throw new ConflictException("Un vendeur avec ID " + req.idVendeur() + " existe déjà");
        Vendeur v = mapper.toEntity(req);
        return mapper.toResponse(repository.save(v));
    }

    @Override
    @Transactional
    public VendeurResponse update(Long id, VendeurRequest req) {
        Vendeur v = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendeur", id));
        mapper.update(v, req);
        return mapper.toResponse(repository.save(v));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id))
            throw new ResourceNotFoundException("Vendeur", id);
        repository.deleteById(id);
    }
}
