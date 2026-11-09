package com.scom.hibernate.dto;

import jakarta.validation.constraints.*;

public record UtilisateurRequest(
    @NotNull Long idUtilisateur,
    @NotBlank @Size(max = 100) String loginUtilisateur,
    @NotBlank @Size(min = 4, max = 255) String passwordUtilisateur,
    @Size(max = 100) String nomUtilisateur,
    @Email @Size(max = 150) String emailUtilisateur,
    @Size(max = 50) String roleUtilisateur
) {}
