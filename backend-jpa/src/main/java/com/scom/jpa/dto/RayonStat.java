package com.scom.jpa.dto;

import java.math.BigDecimal;

public record RayonStat(
    Long idRayon,
    String nomRayon,
    Long nombreVendeurs,
    BigDecimal ventesTotales
) {}
