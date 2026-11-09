package com.scom.jpa.repository;

import com.scom.jpa.entity.Vendeur;
import com.scom.jpa.dto.VendeurClassement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendeurRepository extends JpaRepository<Vendeur, Long> {

    List<Vendeur> findByNomVendeurContainingIgnoreCase(String nom);
    boolean existsByCodeVendeur(String code);

    // Full-text search across code / nom / prenom
    @Query("""
           SELECT v FROM Vendeur v
           WHERE LOWER(v.codeVendeur)   LIKE LOWER(CONCAT('%', :q, '%'))
              OR LOWER(v.nomVendeur)    LIKE LOWER(CONCAT('%', :q, '%'))
              OR LOWER(v.prenomVendeur) LIKE LOWER(CONCAT('%', :q, '%'))
           """)
    List<Vendeur> search(@Param("q") String q);

    // Classement (top vendeurs) : nombre de bons + total ventes + total commissions
    @Query("""
           SELECT new com.scom.jpa.dto.VendeurClassement(
              v.idVendeur, v.codeVendeur, v.nomVendeur,
              COUNT(DISTINCT b.idBonCommande),
              COALESCE(SUM(DISTINCT b.montantBon), 0),
              COALESCE((SELECT SUM(c.montantCommission) FROM Commission c WHERE c.vendeur = v), 0)
           )
           FROM Vendeur v
           LEFT JOIN v.bonsCommandes b
           GROUP BY v.idVendeur, v.codeVendeur, v.nomVendeur
           ORDER BY COALESCE(SUM(DISTINCT b.montantBon), 0) DESC
           """)
    List<VendeurClassement> classement();
}
