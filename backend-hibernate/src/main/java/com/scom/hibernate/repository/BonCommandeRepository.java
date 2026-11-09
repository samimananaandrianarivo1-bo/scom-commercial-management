package com.scom.hibernate.repository;

import com.scom.hibernate.entity.BonCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BonCommandeRepository extends JpaRepository<BonCommande, Long> {
    List<BonCommande> findByVendeurIdVendeur(Long idVendeur);
    boolean existsByNumeroBon(String numero);
}
