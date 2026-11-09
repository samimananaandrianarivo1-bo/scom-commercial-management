package com.scom.hibernate.service;

import com.scom.hibernate.dto.BonCommandeRequest;
import com.scom.hibernate.dto.BonCommandeResponse;
import java.util.List;

public interface BonCommandeService {
    List<BonCommandeResponse> findAll();
    BonCommandeResponse findById(Long id);
    BonCommandeResponse create(BonCommandeRequest request);
    BonCommandeResponse update(Long id, BonCommandeRequest request);
    void delete(Long id);
}
