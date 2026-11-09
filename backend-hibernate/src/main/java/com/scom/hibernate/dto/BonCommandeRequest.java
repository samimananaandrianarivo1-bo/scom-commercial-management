package com.scom.hibernate.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record BonCommandeRequest(
    @NotNull Long idBonCommande,
    @NotBlank @Size(max = 50) String numeroBon,
    @NotNull LocalDate dateBon,
    @NotNull @DecimalMin(value = "0.0", inclusive = true) BigDecimal montantBon,
    @Size(max = 30) String statutBon,
    Long idVendeur
) {}
