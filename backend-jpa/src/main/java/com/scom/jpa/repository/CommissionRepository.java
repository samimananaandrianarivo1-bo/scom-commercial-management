package com.scom.jpa.repository;

import com.scom.jpa.entity.Commission;
import com.scom.jpa.dto.MoisMontant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, Long> {

    List<Commission> findByVendeurIdVendeur(Long id);

    @Query("SELECT COALESCE(SUM(c.montantCommission),0) FROM Commission c")
    BigDecimal sumMontants();

    @Query(value = """
           SELECT DATE_FORMAT(date_commission, '%Y-%m') AS mois,
                  COALESCE(SUM(montant_commission), 0) AS montant
           FROM COMMISSION
           WHERE date_commission IS NOT NULL
           GROUP BY DATE_FORMAT(date_commission, '%Y-%m')
           ORDER BY mois ASC
           """, nativeQuery = true)
    List<Object[]> commissionsParMoisRaw();

    default List<MoisMontant> commissionsParMois() {
        return commissionsParMoisRaw().stream()
            .map(row -> new MoisMontant(
                (String) row[0],
                row[1] instanceof BigDecimal b ? b : BigDecimal.valueOf(((Number) row[1]).doubleValue())
            )).toList();
    }
}
