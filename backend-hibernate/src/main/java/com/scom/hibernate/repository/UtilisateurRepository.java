package com.scom.hibernate.repository;

import com.scom.hibernate.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByLoginUtilisateur(String login);
    boolean existsByLoginUtilisateur(String login);
}
