package com.scom.hibernate.service;

import com.scom.hibernate.dto.RayonRequest;
import com.scom.hibernate.dto.RayonResponse;
import java.util.List;

public interface RayonService {
    List<RayonResponse> findAll();
    RayonResponse findById(Long id);
    RayonResponse create(RayonRequest request);
    RayonResponse update(Long id, RayonRequest request);
    void delete(Long id);
}
