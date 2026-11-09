package com.scom.hibernate.service;

import com.scom.hibernate.dto.PaiementRequest;
import com.scom.hibernate.dto.PaiementResponse;
import java.util.List;

public interface PaiementService {
    List<PaiementResponse> findAll();
    PaiementResponse findById(Long id);
    PaiementResponse create(PaiementRequest request);
    PaiementResponse update(Long id, PaiementRequest request);
    void delete(Long id);
}
