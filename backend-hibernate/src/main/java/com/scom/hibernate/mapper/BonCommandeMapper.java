package com.scom.hibernate.mapper;

import com.scom.hibernate.dto.BonCommandeRequest;
import com.scom.hibernate.dto.BonCommandeResponse;
import com.scom.hibernate.entity.BonCommande;
import com.scom.hibernate.entity.Vendeur;
import org.springframework.stereotype.Component;

@Component
public class BonCommandeMapper {
    public BonCommande toEntity(BonCommandeRequest r, Vendeur v) {
        return BonCommande.builder()
                .idBonCommande(r.idBonCommande())
                .numeroBon(r.numeroBon())
                .dateBon(r.dateBon())
                .montantBon(r.montantBon())
                .statutBon(r.statutBon())
                .vendeur(v)
                .build();
    }
    public void update(BonCommande b, BonCommandeRequest r, Vendeur v) {
        b.setNumeroBon(r.numeroBon());
        b.setDateBon(r.dateBon());
        b.setMontantBon(r.montantBon());
        b.setStatutBon(r.statutBon());
        b.setVendeur(v);
    }
    public BonCommandeResponse toResponse(BonCommande b) {
        return new BonCommandeResponse(
            b.getIdBonCommande(),
            b.getNumeroBon(),
            b.getDateBon(),
            b.getMontantBon(),
            b.getStatutBon(),
            b.getVendeur() != null ? b.getVendeur().getIdVendeur() : null,
            b.getVendeur() != null ? b.getVendeur().getNomVendeur() : null
        );
    }
}
