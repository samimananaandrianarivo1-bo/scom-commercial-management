package com.scom.jpa.repository;

import com.scom.jpa.entity.BonCommande;
import com.scom.jpa.dto.MoisMontant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface BonCommandeRepository extends JpaRepository<BonCommande, Long> {

    List<BonCommande> findByVendeurIdVendeur(Long id);

    @Query("SELECT COALESCE(SUM(b.montantBon),0) FROM BonCommande b")
    BigDecimal sumMontants();

    @Query(value = """
           SELECT DATE_FORMAT(date_bon, '%Y-%m') AS mois,
                  COALESCE(SUM(montant_bon), 0) AS montant
           FROM BON_COMMANDE
           WHERE date_bon IS NOT NULL
           GROUP BY DATE_FORMAT(date_bon, '%Y-%m')
           ORDER BY mois ASC
           """, nativeQuery = true)
    List<Object[]> ventesParMoisRaw();

    default List<MoisMontant> ventesParMois() {
        return ventesParMoisRaw().stream()
            .map(row -> new MoisMontant(
                (String) row[0],
                row[1] instanceof BigDecimal b ? b : BigDecimal.valueOf(((Number) row[1]).doubleValue())
            )).toList();
    }
}
