package com.scom.hibernate.mapper;

import com.scom.hibernate.dto.VendeurRequest;
import com.scom.hibernate.dto.VendeurResponse;
import com.scom.hibernate.entity.Vendeur;
import org.springframework.stereotype.Component;

@Component
public class VendeurMapper {

    public Vendeur toEntity(VendeurRequest r) {
        return Vendeur.builder()
                .idVendeur(r.idVendeur())
                .codeVendeur(r.codeVendeur())
                .nomVendeur(r.nomVendeur())
                .prenomVendeur(r.prenomVendeur())
                .emailVendeur(r.emailVendeur())
                .telephoneVendeur(r.telephoneVendeur())
                .adresseVendeur(r.adresseVendeur())
                .build();
    }

    public void update(Vendeur v, VendeurRequest r) {
        v.setCodeVendeur(r.codeVendeur());
        v.setNomVendeur(r.nomVendeur());
        v.setPrenomVendeur(r.prenomVendeur());
        v.setEmailVendeur(r.emailVendeur());
        v.setTelephoneVendeur(r.telephoneVendeur());
        v.setAdresseVendeur(r.adresseVendeur());
    }

    public VendeurResponse toResponse(Vendeur v) {
        return new VendeurResponse(
            v.getIdVendeur(),
            v.getCodeVendeur(),
            v.getNomVendeur(),
            v.getPrenomVendeur(),
            v.getEmailVendeur(),
            v.getTelephoneVendeur(),
            v.getAdresseVendeur(),
            v.getBonsCommandes() != null ? v.getBonsCommandes().size() : 0,
            v.getCommissions() != null ? v.getCommissions().size() : 0,
            v.getRayons() != null ? v.getRayons().size() : 0
        );
    }
}
