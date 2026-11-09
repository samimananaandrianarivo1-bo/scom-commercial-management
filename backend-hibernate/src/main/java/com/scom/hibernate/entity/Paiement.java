package com.scom.hibernate.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "PAIEMENT")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Paiement {

    @Id
    @Column(name = "ID_paiement")
    private Long idPaiement;

    @Column(name = "code_paiement", length = 50)
    private String codePaiement;

    @Column(name = "mode_paiement", length = 50)
    private String modePaiement;

    @Column(name = "montant_paiement", precision = 15, scale = 2)
    private BigDecimal montantPaiement;

    @Column(name = "date_paiement")
    private LocalDate datePaiement;

    @ManyToMany(mappedBy = "paiements", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<BonCommande> bonsCommandes = new HashSet<>();
}
