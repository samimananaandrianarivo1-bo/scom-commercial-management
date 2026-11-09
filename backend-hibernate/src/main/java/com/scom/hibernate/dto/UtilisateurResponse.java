package com.scom.hibernate.dto;

public record UtilisateurResponse(
    Long idUtilisateur,
    String loginUtilisateur,
    String nomUtilisateur,
    String emailUtilisateur,
    String roleUtilisateur,
    String photoUtilisateur
) {}
