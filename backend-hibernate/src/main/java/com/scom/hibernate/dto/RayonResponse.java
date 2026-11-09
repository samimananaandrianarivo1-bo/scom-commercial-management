package com.scom.hibernate.dto;

public record RayonResponse(
    Long idRayon,
    String codeRayon,
    String nomRayon,
    String descriptionRayon,
    int nombreVendeurs
) {}
