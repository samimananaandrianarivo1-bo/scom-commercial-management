package com.scom.hibernate.repository;

import com.scom.hibernate.entity.Vendeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VendeurRepository extends JpaRepository<Vendeur, Long> {
    List<Vendeur> findByNomVendeurContainingIgnoreCase(String nom);
    boolean existsByCodeVendeur(String code);
}
