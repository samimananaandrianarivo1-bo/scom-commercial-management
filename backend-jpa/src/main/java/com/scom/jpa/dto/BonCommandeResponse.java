package com.scom.jpa.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BonCommandeResponse(
    Long idBonCommande,
    String numeroBon,
    LocalDate dateBon,
    BigDecimal montantBon,
    String statutBon,
    Long idVendeur,
    String nomVendeur
) {}
