package com.scom.jpa.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record CommissionRequest(
    @NotNull Long idCommission,
    @NotBlank @Size(max = 50) String codeCommission,
    @NotNull @DecimalMin(value = "0.0") BigDecimal tauxCommission,
    @NotNull @DecimalMin(value = "0.0") BigDecimal montantCommission,
    LocalDate dateCommission,
    Long idVendeur
) {}
