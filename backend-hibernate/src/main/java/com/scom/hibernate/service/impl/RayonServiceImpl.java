package com.scom.hibernate.service.impl;

import com.scom.hibernate.dto.RayonRequest;
import com.scom.hibernate.dto.RayonResponse;
import com.scom.hibernate.entity.Rayon;
import com.scom.hibernate.exception.ConflictException;
import com.scom.hibernate.exception.ResourceNotFoundException;
import com.scom.hibernate.mapper.RayonMapper;
import com.scom.hibernate.repository.RayonRepository;
import com.scom.hibernate.service.RayonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RayonServiceImpl implements RayonService {

    private final RayonRepository repository;
    private final RayonMapper mapper;

    @Override @Transactional(readOnly = true)
    public List<RayonResponse> findAll() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override @Transactional(readOnly = true)
    public RayonResponse findById(Long id) {
        return mapper.toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rayon", id)));
    }

    @Override @Transactional
    public RayonResponse create(RayonRequest req) {
        if (repository.existsById(req.idRayon()))
            throw new ConflictException("Un rayon avec ID " + req.idRayon() + " existe déjà");
        return mapper.toResponse(repository.save(mapper.toEntity(req)));
    }

    @Override @Transactional
    public RayonResponse update(Long id, RayonRequest req) {
        Rayon e = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rayon", id));
        mapper.update(e, req);
        return mapper.toResponse(repository.save(e));
    }

    @Override @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id))
            throw new ResourceNotFoundException("Rayon", id);
        repository.deleteById(id);
    }
}
