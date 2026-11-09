package com.scom.hibernate.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "VENDEUR")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vendeur {

    @Id
    @Column(name = "ID_vendeur")
    private Long idVendeur;

    @Column(name = "code_vendeur", length = 50)
    private String codeVendeur;

    @Column(name = "nom_vendeur", length = 100)
    private String nomVendeur;

    @Column(name = "prenom_vendeur", length = 100)
    private String prenomVendeur;

    @Column(name = "email_vendeur", length = 150)
    private String emailVendeur;

    @Column(name = "telephone_vendeur", length = 30)
    private String telephoneVendeur;

    @Column(name = "adresse_vendeur", length = 255)
    private String adresseVendeur;

    // Vendeur -> BonCommande (1..N)
    @OneToMany(mappedBy = "vendeur", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<BonCommande> bonsCommandes = new HashSet<>();

    // Vendeur -> Commission (1..N)
    @OneToMany(mappedBy = "vendeur", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Commission> commissions = new HashSet<>();

    // Vendeur <-> Rayon via EXPLOITER
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "EXPLOITER",
        joinColumns = @JoinColumn(name = "ID_vendeur"),
        inverseJoinColumns = @JoinColumn(name = "ID_rayon")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Rayon> rayons = new HashSet<>();
}
