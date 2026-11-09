package com.scom.jpa.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardStats(
    long totalVendeurs,
    long totalRayons,
    long totalBonsCommandes,
    long totalUtilisateurs,
    BigDecimal totalVentes,
    BigDecimal totalCommissions,
    BigDecimal totalPaiements,
    List<VendeurClassement> topVendeurs,
    List<RayonStat> rayonStats,
    List<MoisMontant> ventesParMois,
    List<MoisMontant> commissionsParMois
) {}
