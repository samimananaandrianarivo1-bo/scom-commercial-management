package com.scom.hibernate.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "BON_COMMANDE")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BonCommande {

    @Id
    @Column(name = "ID_bon_commande")
    private Long idBonCommande;

    @Column(name = "numero_bon", length = 50)
    private String numeroBon;

    @Column(name = "date_bon")
    private LocalDate dateBon;

    @Column(name = "montant_bon", precision = 15, scale = 2)
    private BigDecimal montantBon;

    @Column(name = "statut_bon", length = 30)
    private String statutBon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_vendeur")
    @ToString.Exclude
    private Vendeur vendeur;

    // BonCommande <-> Paiement via ETRE_PAYE_PAR
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "ETRE_PAYE_PAR",
        joinColumns = @JoinColumn(name = "ID_bon_commande"),
        inverseJoinColumns = @JoinColumn(name = "ID_paiement")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Paiement> paiements = new HashSet<>();
}
