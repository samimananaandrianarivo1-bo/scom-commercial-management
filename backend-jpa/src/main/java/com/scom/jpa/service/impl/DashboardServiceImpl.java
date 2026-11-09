package com.scom.jpa.service.impl;

import com.scom.jpa.dto.DashboardStats;
import com.scom.jpa.repository.*;
import com.scom.jpa.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final VendeurRepository vendeurRepo;
    private final RayonRepository rayonRepo;
    private final BonCommandeRepository bonRepo;
    private final CommissionRepository commissionRepo;
    private final PaiementRepository paiementRepo;
    private final UtilisateurRepository utilisateurRepo;

    @Override
    @Transactional(readOnly = true)
    public DashboardStats compute() {
        var top = vendeurRepo.classement();
        // Limite les 5 premiers vendeurs
        var top5 = top.size() > 5 ? top.subList(0, 5) : top;

        return new DashboardStats(
            vendeurRepo.count(),
            rayonRepo.count(),
            bonRepo.count(),
            utilisateurRepo.count(),
            bonRepo.sumMontants(),
            commissionRepo.sumMontants(),
            paiementRepo.sumMontants(),
            top5,
            rayonRepo.statistiques(),
            bonRepo.ventesParMois(),
            commissionRepo.commissionsParMois()
        );
    }
}
