package com.scom.jpa.dto;

public record VendeurResponse(
    Long idVendeur,
    String codeVendeur,
    String nomVendeur,
    String prenomVendeur,
    String emailVendeur,
    String telephoneVendeur,
    String adresseVendeur,
    int nombreBonsCommandes,
    int nombreCommissions,
    int nombreRayons
) {}
