package com.scom.jpa.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "UTILISATEUR")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Utilisateur {

    @Id
    @Column(name = "ID_utilisateur")
    private Long idUtilisateur;

    @Column(name = "login_utilisateur", length = 100, unique = true)
    private String loginUtilisateur;

    @Column(name = "password_utilisateur", length = 255)
    private String passwordUtilisateur;

    @Column(name = "nom_utilisateur", length = 100)
    private String nomUtilisateur;

    @Column(name = "email_utilisateur", length = 150)
    private String emailUtilisateur;

    @Column(name = "role_utilisateur", length = 50)
    private String roleUtilisateur;

    @Column(name = "photo_utilisateur", columnDefinition = "TEXT")
    private String photoUtilisateur;
}
