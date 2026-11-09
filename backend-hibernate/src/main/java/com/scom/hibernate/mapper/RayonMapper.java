package com.scom.hibernate.mapper;

import com.scom.hibernate.dto.RayonRequest;
import com.scom.hibernate.dto.RayonResponse;
import com.scom.hibernate.entity.Rayon;
import org.springframework.stereotype.Component;

@Component
public class RayonMapper {
    public Rayon toEntity(RayonRequest r) {
        return Rayon.builder()
                .idRayon(r.idRayon())
                .codeRayon(r.codeRayon())
                .nomRayon(r.nomRayon())
                .descriptionRayon(r.descriptionRayon())
                .build();
    }
    public void update(Rayon e, RayonRequest r) {
        e.setCodeRayon(r.codeRayon());
        e.setNomRayon(r.nomRayon());
        e.setDescriptionRayon(r.descriptionRayon());
    }
    public RayonResponse toResponse(Rayon e) {
        return new RayonResponse(
            e.getIdRayon(), e.getCodeRayon(), e.getNomRayon(), e.getDescriptionRayon(),
            e.getVendeurs() != null ? e.getVendeurs().size() : 0
        );
    }
}
