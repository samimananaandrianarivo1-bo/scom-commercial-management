package com.scom.jpa.repository;

import com.scom.jpa.entity.Rayon;
import com.scom.jpa.dto.RayonStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RayonRepository extends JpaRepository<Rayon, Long> {

    boolean existsByCodeRayon(String code);

    @Query("""
           SELECT new com.scom.jpa.dto.RayonStat(
              r.idRayon, r.nomRayon,
              COUNT(DISTINCT v.idVendeur),
              COALESCE(SUM(DISTINCT b.montantBon), 0)
           )
           FROM Rayon r
           LEFT JOIN r.vendeurs v
           LEFT JOIN v.bonsCommandes b
           GROUP BY r.idRayon, r.nomRayon
           ORDER BY r.nomRayon ASC
           """)
    List<RayonStat> statistiques();
}
