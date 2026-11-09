package com.scom.hibernate.mapper;

import com.scom.hibernate.dto.UtilisateurRequest;
import com.scom.hibernate.dto.UtilisateurResponse;
import com.scom.hibernate.entity.Utilisateur;
import org.springframework.stereotype.Component;

@Component
public class UtilisateurMapper {
    public Utilisateur toEntity(UtilisateurRequest r) {
        return Utilisateur.builder()
                .idUtilisateur(r.idUtilisateur())
                .loginUtilisateur(r.loginUtilisateur())
                .passwordUtilisateur(r.passwordUtilisateur())
                .nomUtilisateur(r.nomUtilisateur())
                .emailUtilisateur(r.emailUtilisateur())
                .roleUtilisateur(r.roleUtilisateur())
                .build();
    }
    public void update(Utilisateur u, UtilisateurRequest r) {
        u.setLoginUtilisateur(r.loginUtilisateur());
        if (r.passwordUtilisateur() != null && !r.passwordUtilisateur().isBlank())
            u.setPasswordUtilisateur(r.passwordUtilisateur());
        u.setNomUtilisateur(r.nomUtilisateur());
        u.setEmailUtilisateur(r.emailUtilisateur());
        u.setRoleUtilisateur(r.roleUtilisateur());
    }
    public UtilisateurResponse toResponse(Utilisateur u) {
        return new UtilisateurResponse(
            u.getIdUtilisateur(), u.getLoginUtilisateur(), u.getNomUtilisateur(),
            u.getEmailUtilisateur(), u.getRoleUtilisateur(), u.getPhotoUtilisateur());
    }
}
