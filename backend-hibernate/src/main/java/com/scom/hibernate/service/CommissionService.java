package com.scom.hibernate.service;

import com.scom.hibernate.dto.CommissionRequest;
import com.scom.hibernate.dto.CommissionResponse;
import java.util.List;

public interface CommissionService {
    List<CommissionResponse> findAll();
    CommissionResponse findById(Long id);
    CommissionResponse create(CommissionRequest request);
    CommissionResponse update(Long id, CommissionRequest request);
    void delete(Long id);
}
