package com.scom.jpa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "COMMISSION")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Commission {

    @Id
    @Column(name = "ID_commission")
    private Long idCommission;

    @Column(name = "code_commission", length = 50)
    private String codeCommission;

    @Column(name = "taux_commission", precision = 6, scale = 2)
    private BigDecimal tauxCommission;

    @Column(name = "montant_commission", precision = 15, scale = 2)
    private BigDecimal montantCommission;

    @Column(name = "date_commission")
    private LocalDate dateCommission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_vendeur")
    @ToString.Exclude
    private Vendeur vendeur;
}
