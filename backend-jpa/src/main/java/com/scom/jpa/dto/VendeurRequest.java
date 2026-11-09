package com.scom.jpa.dto;

import jakarta.validation.constraints.*;

public record VendeurRequest(
    @NotNull(message = "L'identifiant du vendeur est obligatoire")
    Long idVendeur,
    @NotBlank(message = "Le code vendeur est obligatoire")
    @Size(max = 50)
    String codeVendeur,
    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100)
    String nomVendeur,
    @Size(max = 100)
    String prenomVendeur,
    @Email(message = "Email invalide")
    String emailVendeur,
    @Size(max = 30)
    String telephoneVendeur,
    @Size(max = 255)
    String adresseVendeur
) {}
