package com.scom.jpa.service.impl;

import com.scom.jpa.dto.RayonStat;
import com.scom.jpa.dto.VendeurClassement;
import com.scom.jpa.repository.RayonRepository;
import com.scom.jpa.repository.VendeurRepository;
import com.scom.jpa.service.StatistiqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatistiqueServiceImpl implements StatistiqueService {

    private final VendeurRepository vendeurRepo;
    private final RayonRepository rayonRepo;

    @Override @Transactional(readOnly = true)
    public List<VendeurClassement> classementVendeurs() { return vendeurRepo.classement(); }

    @Override @Transactional(readOnly = true)
    public List<RayonStat> statistiquesRayons() { return rayonRepo.statistiques(); }
}
