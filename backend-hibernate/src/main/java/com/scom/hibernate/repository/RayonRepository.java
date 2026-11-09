package com.scom.hibernate.repository;

import com.scom.hibernate.entity.Rayon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RayonRepository extends JpaRepository<Rayon, Long> {
    boolean existsByCodeRayon(String code);
}
