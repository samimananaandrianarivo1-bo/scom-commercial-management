package com.scom.hibernate.service;

import com.scom.hibernate.dto.LoginRequest;
import com.scom.hibernate.dto.UtilisateurRequest;
import com.scom.hibernate.dto.UtilisateurResponse;
import java.util.List;

public interface UtilisateurService {
    List<UtilisateurResponse> findAll();
    UtilisateurResponse findById(Long id);
    UtilisateurResponse create(UtilisateurRequest request);
    UtilisateurResponse update(Long id, UtilisateurRequest request);
    void delete(Long id);
    UtilisateurResponse authenticate(LoginRequest request);
    UtilisateurResponse updatePhoto(Long id, String photo);
}
