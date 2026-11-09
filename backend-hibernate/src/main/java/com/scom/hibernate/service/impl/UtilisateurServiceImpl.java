package com.scom.hibernate.service.impl;

import com.scom.hibernate.dto.LoginRequest;
import com.scom.hibernate.dto.UtilisateurRequest;
import com.scom.hibernate.dto.UtilisateurResponse;
import com.scom.hibernate.entity.Utilisateur;
import com.scom.hibernate.exception.ConflictException;
import com.scom.hibernate.exception.ResourceNotFoundException;
import com.scom.hibernate.mapper.UtilisateurMapper;
import com.scom.hibernate.repository.UtilisateurRepository;
import com.scom.hibernate.service.UtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UtilisateurServiceImpl implements UtilisateurService {

    private final UtilisateurRepository repository;
    private final UtilisateurMapper mapper;

    @Override @Transactional(readOnly = true)
    public List<UtilisateurResponse> findAll() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override @Transactional(readOnly = true)
    public UtilisateurResponse findById(Long id) {
        return mapper.toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", id)));
    }

    @Override @Transactional
    public UtilisateurResponse create(UtilisateurRequest req) {
        if (repository.existsById(req.idUtilisateur()))
            throw new ConflictException("Utilisateur ID " + req.idUtilisateur() + " existe déjà");
        if (repository.existsByLoginUtilisateur(req.loginUtilisateur()))
            throw new ConflictException("Login déjà utilisé : " + req.loginUtilisateur());
        return mapper.toResponse(repository.save(mapper.toEntity(req)));
    }

    @Override @Transactional
    public UtilisateurResponse update(Long id, UtilisateurRequest req) {
        Utilisateur u = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", id));
        mapper.update(u, req);
        return mapper.toResponse(repository.save(u));
    }

    @Override @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id))
            throw new ResourceNotFoundException("Utilisateur", id);
        repository.deleteById(id);
    }

    @Override @Transactional(readOnly = true)
    public UtilisateurResponse authenticate(LoginRequest req) {
        Utilisateur u = repository.findByLoginUtilisateur(req.login())
                .orElseThrow(() -> new ResourceNotFoundException("Login invalide"));
        if (!Objects.equals(req.password(), u.getPasswordUtilisateur()))
            throw new IllegalArgumentException("Mot de passe incorrect");
        return mapper.toResponse(u);
    }

    @Override @Transactional
    public UtilisateurResponse updatePhoto(Long id, String photo) {
        Utilisateur u = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", id));
        u.setPhotoUtilisateur(photo);
        return mapper.toResponse(repository.save(u));
    }
}
