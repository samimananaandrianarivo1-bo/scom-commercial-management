package com.scom.hibernate.mapper;

import com.scom.hibernate.dto.CommissionRequest;
import com.scom.hibernate.dto.CommissionResponse;
import com.scom.hibernate.entity.Commission;
import com.scom.hibernate.entity.Vendeur;
import org.springframework.stereotype.Component;

@Component
public class CommissionMapper {
    public Commission toEntity(CommissionRequest r, Vendeur v) {
        return Commission.builder()
                .idCommission(r.idCommission())
                .codeCommission(r.codeCommission())
                .tauxCommission(r.tauxCommission())
                .montantCommission(r.montantCommission())
                .dateCommission(r.dateCommission())
                .vendeur(v)
                .build();
    }
    public void update(Commission c, CommissionRequest r, Vendeur v) {
        c.setCodeCommission(r.codeCommission());
        c.setTauxCommission(r.tauxCommission());
        c.setMontantCommission(r.montantCommission());
        c.setDateCommission(r.dateCommission());
        c.setVendeur(v);
    }
    public CommissionResponse toResponse(Commission c) {
        return new CommissionResponse(
            c.getIdCommission(),
            c.getCodeCommission(),
            c.getTauxCommission(),
            c.getMontantCommission(),
            c.getDateCommission(),
            c.getVendeur() != null ? c.getVendeur().getIdVendeur() : null,
            c.getVendeur() != null ? c.getVendeur().getNomVendeur() : null
        );
    }
}
