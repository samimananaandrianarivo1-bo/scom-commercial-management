package com.scom.jpa.service;

import com.scom.jpa.dto.RayonStat;
import com.scom.jpa.dto.VendeurClassement;
import java.util.List;

public interface StatistiqueService {
    List<VendeurClassement> classementVendeurs();
    List<RayonStat> statistiquesRayons();
}
