package com.scom.jpa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "RAYON")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Rayon {

    @Id
    @Column(name = "ID_rayon")
    private Long idRayon;

    @Column(name = "code_rayon", length = 50)
    private String codeRayon;

    @Column(name = "nom_rayon", length = 100)
    private String nomRayon;

    @Column(name = "description_rayon", length = 500)
    private String descriptionRayon;

    // Many-to-many through EXPLOITER (Vendeur exploite Rayon)
    @ManyToMany(mappedBy = "rayons", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Vendeur> vendeurs = new HashSet<>();
}
