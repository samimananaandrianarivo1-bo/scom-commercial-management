package com.scom.jpa.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CommissionResponse(
    Long idCommission,
    String codeCommission,
    BigDecimal tauxCommission,
    BigDecimal montantCommission,
    LocalDate dateCommission,
    Long idVendeur,
    String nomVendeur
) {}
