package com.scom.jpa.dto;

import java.math.BigDecimal;

public record VendeurClassement(
    Long idVendeur,
    String codeVendeur,
    String nomVendeur,
    Long nombreBonsCommandes,
    BigDecimal totalVentes,
    BigDecimal totalCommissions
) {}
