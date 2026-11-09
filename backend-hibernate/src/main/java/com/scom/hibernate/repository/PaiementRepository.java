package com.scom.hibernate.repository;

import com.scom.hibernate.entity.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    boolean existsByCodePaiement(String code);
}
