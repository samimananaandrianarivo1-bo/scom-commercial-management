package com.scom.hibernate.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record PaiementRequest(
    @NotNull Long idPaiement,
    @NotBlank @Size(max = 50) String codePaiement,
    @NotBlank @Size(max = 50) String modePaiement,
    @NotNull @DecimalMin(value = "0.0") BigDecimal montantPaiement,
    LocalDate datePaiement
) {}
