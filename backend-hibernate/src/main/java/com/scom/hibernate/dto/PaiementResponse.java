package com.scom.hibernate.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PaiementResponse(
    Long idPaiement,
    String codePaiement,
    String modePaiement,
    BigDecimal montantPaiement,
    LocalDate datePaiement
) {}
