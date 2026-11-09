package com.scom.hibernate.repository;

import com.scom.hibernate.entity.Commission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, Long> {
    List<Commission> findByVendeurIdVendeur(Long idVendeur);
}
