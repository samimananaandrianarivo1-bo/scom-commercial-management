package com.scom.jpa.dto;

import jakarta.validation.constraints.*;

public record RayonRequest(
    @NotNull Long idRayon,
    @NotBlank @Size(max = 50) String codeRayon,
    @NotBlank @Size(max = 100) String nomRayon,
    @Size(max = 500) String descriptionRayon
) {}
