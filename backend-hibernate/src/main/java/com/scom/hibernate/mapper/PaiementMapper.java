package com.scom.hibernate.mapper;

import com.scom.hibernate.dto.PaiementRequest;
import com.scom.hibernate.dto.PaiementResponse;
import com.scom.hibernate.entity.Paiement;
import org.springframework.stereotype.Component;

@Component
public class PaiementMapper {
    public Paiement toEntity(PaiementRequest r) {
        return Paiement.builder()
                .idPaiement(r.idPaiement())
                .codePaiement(r.codePaiement())
                .modePaiement(r.modePaiement())
                .montantPaiement(r.montantPaiement())
                .datePaiement(r.datePaiement())
                .build();
    }
    public void update(Paiement p, PaiementRequest r) {
        p.setCodePaiement(r.codePaiement());
        p.setModePaiement(r.modePaiement());
        p.setMontantPaiement(r.montantPaiement());
        p.setDatePaiement(r.datePaiement());
    }
    public PaiementResponse toResponse(Paiement p) {
        return new PaiementResponse(
            p.getIdPaiement(), p.getCodePaiement(), p.getModePaiement(),
            p.getMontantPaiement(), p.getDatePaiement());
    }
}
