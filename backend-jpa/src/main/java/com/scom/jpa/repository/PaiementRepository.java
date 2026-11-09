package com.scom.jpa.repository;

import com.scom.jpa.entity.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    @Query("SELECT COALESCE(SUM(p.montantPaiement),0) FROM Paiement p")
    BigDecimal sumMontants();
}
