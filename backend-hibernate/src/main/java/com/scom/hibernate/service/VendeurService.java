package com.scom.hibernate.service;

import com.scom.hibernate.dto.VendeurRequest;
import com.scom.hibernate.dto.VendeurResponse;
import java.util.List;

public interface VendeurService {
    List<VendeurResponse> findAll();
    VendeurResponse findById(Long id);
    VendeurResponse create(VendeurRequest request);
    VendeurResponse update(Long id, VendeurRequest request);
    void delete(Long id);
}
