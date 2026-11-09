import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, AreaChart, Area
} from 'recharts';
import {
  FiUsers, FiGrid, FiFileText, FiTrendingUp,
  FiBell, FiAlertTriangle, FiCheckCircle,
  FiClock
} from 'react-icons/fi';
import Topbar from '../components/layout/Topbar.jsx';
import { dashboardService } from '../services/dashboardService';
import { bonCommandeService } from '../services/bonCommandeService';
import { formatAriary } from '../utils/formatCurrency';
import CurrencyDisplay from '../components/common/CurrencyDisplay.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';

const PIE_COLORS = ['#13294B', '#2563EB', '#059669', '#3b82f6', '#60a5fa', '#93c5fd'];

function formatMonth(m) {
  if (!m) return '';
  const [, mo] = m.split('-');
  const months = ['', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  return months[parseInt(mo, 10)] || m;
}

const AXIS_STYLE = { fontSize: 12, fill: '#64748b', fontWeight: 500 };

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#13294B', color: '#fff', padding: '10px 14px',
      borderRadius: 8, fontSize: 12.5, boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      border: 'none', lineHeight: 1.6, fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 3, fontSize: 13 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: '#93c5fd' }}>
          Montant: <b style={{ color: '#fff' }}>{formatAriary(p.value)}</b>
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      background: '#13294B', color: '#fff', padding: '8px 12px',
      borderRadius: 8, fontSize: 12.5, boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      border: 'none', fontFamily: 'Inter, sans-serif',
    }}>
      <b>{d.name}</b><br />
      <span style={{ color: '#93c5fd' }}>{formatAriary(d.value)}</span>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [chartView, setChartView] = useState('mensuel');
  const { notifications, unreadCount, markAllRead } = useNotifications();

  useEffect(() => {
    dashboardService.stats()
      .then(setStats)
      .catch(e => setError(e.message || 'Erreur de chargement'));
    bonCommandeService.list()
      .then(data => setOrders(Array.isArray(data) ? data.slice(-5).reverse() : []))
      .catch(() => {});
  }, []);

  if (error) return (
    <>
      <Topbar title="Dashboard" subtitle="Vue d'ensemble du système SCOM" />
      <div className="content">
        <div className="card"><div className="empty-state">
          <div className="empty-state__icon">⚠️</div>
          <b>Impossible de charger le dashboard</b>
          <div className="text-muted" style={{ marginTop: 6 }}>{error}</div>
        </div></div>
      </div>
    </>
  );

  if (!stats) return (
    <>
      <Topbar title="Dashboard" subtitle="Chargement..." />
      <div className="content"><div className="spinner" /></div>
    </>
  );

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const kpis = [
    { icon: <FiUsers />,         label: 'Vendeurs actifs',   value: stats.totalVendeurs,      isCurrency: false, trend: '↑ 12% vs mois dernier', pct: 75, trendUp: true },
    { icon: <FiGrid />,          label: 'Rayons disponibles', value: stats.totalRayons,        isCurrency: false, trend: '↑ 8% vs mois dernier',  pct: 62, trendUp: true },
    { icon: <FiFileText />,      label: 'Bons de commande',   value: stats.totalBonsCommandes, isCurrency: false, trend: '↑ 20% vs mois dernier', pct: 85, trendUp: true },
    { icon: <FiTrendingUp />,    label: 'Total des ventes',   value: stats.totalVentes,        isCurrency: true,  trend: '↑ 15% vs mois dernier', pct: 90, trendUp: true, iconGreen: true },
  ];

  const rayonData = (stats.rayonStats || [])
    .filter(r => r.ventesTotales > 0)
    .map(r => ({
      ...r,
      pct: stats.totalVentes > 0
        ? ((Number(r.ventesTotales) / stats.totalVentes) * 100).toFixed(1)
        : 0,
    }))
    .sort((a, b) => b.ventesTotales - a.ventesTotales);

  const rayonTotal = rayonData.reduce((s, r) => s + Number(r.ventesTotales), 0);

  const ventesData = (stats.ventesParMois || []).map(v => ({ ...v, mois: formatMonth(v.mois) }));
  const commissionsData = (stats.commissionsParMois || []).map(v => ({ ...v, mois: formatMonth(v.mois) }));

  const notifTypeClass = (t) =>
    t === 'warn' ? 'notif-item__icon--warn'
    : t === 'success' ? 'notif-item__icon--success'
    : 'notif-item__icon--info';

  const notifIcons = {
    success: <FiCheckCircle size={15} />,
    warn: <FiAlertTriangle size={15} />,
    info: <FiBell size={15} />,
  };

  function statutBadge(s) {
    if (s === 'PAYE')   return <span className="badge badge-success">Livrée</span>;
    if (s === 'ANNULE') return <span className="badge badge-danger">Annulée</span>;
    return <span className="badge badge-warning">En cours</span>;
  }

  return (
    <>
      <Topbar title="Dashboard" subtitle="Vue d'ensemble des activités et performances commerciales de SCOM" />
      <div className="content">
        <div className="page-header">
          <div className="page-header__text">
            <h1>Tableau de bord</h1>
            <p>Vue d'ensemble des activités et performances commerciales de SCOM</p>
          </div>
          <div className="page-header__date">
            <FiClock size={14} />
            {today}
          </div>
        </div>

        {/* KPI */}
        <div className="kpi-grid">
          {kpis.map((k, i) => (
            <div className="kpi-card" key={i}>
              <div className={`kpi-card__icon${k.iconGreen ? ' kpi-card__icon--green' : ''}`}>{k.icon}</div>
              <div className="kpi-card__content">
                <div className="kpi-card__label">{k.label}</div>
                <div className="kpi-card__value">
                  {k.isCurrency ? <CurrencyDisplay value={k.value} size="md" /> : k.value}
                </div>
                <div className={`kpi-card__trend ${k.trendUp ? 'kpi-card__trend--up' : 'kpi-card__trend--down'}`}>{k.trend}</div>
              </div>
              <div className="kpi-card__progress">
                <div className={`kpi-card__progress-bar${k.iconGreen ? ' kpi-card__progress-bar--green' : ''}`} style={{ width: `${k.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid-2">
          <div className="card">
            <div className="card__header">
              <div>
                <div className="card__title">Évolution des ventes</div>
                <div className="card__subtitle">Montants mensuels des bons de commande</div>
              </div>
              <div className="segment">
                <button className={`segment__item ${chartView === 'mensuel' ? 'active' : ''}`}
                  onClick={() => setChartView('mensuel')}>Mensuel</button>
                <button className={`segment__item ${chartView === 'annuel' ? 'active' : ''}`}
                  onClick={() => setChartView('annuel')}>Annuel</button>
              </div>
            </div>
            {ventesData.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={ventesData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e8edf3" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mois" tick={AXIS_STYLE} axisLine={false} tickLine={false} dy={6} />
                  <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="montant" stroke="#2563EB" strokeWidth={2.5}
                    fill="url(#blueGrad)" dot={{ r: 3.5, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 5, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <div className="empty-state">Aucune donnée</div>}
          </div>

          <div className="card">
            <div className="card__header">
              <div>
                <div className="card__title">Commissions par mois</div>
                <div className="card__subtitle">Cumul des commissions versées</div>
              </div>
              <div className="segment">
                <button className="segment__item active">Ce mois</button>
              </div>
            </div>
            {commissionsData.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={commissionsData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                  <CartesianGrid stroke="#e8edf3" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mois" tick={AXIS_STYLE} axisLine={false} tickLine={false} dy={6} />
                  <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="montant" fill="#2563EB" radius={[5, 5, 0, 0]} barSize={26} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="empty-state">Aucune donnée</div>}
          </div>
        </div>

        {/* Row 2: Donut + Commandes + Notifications */}
        <div className="grid-3">
          <div className="card">
            <div className="card__header">
              <div>
                <div className="card__title">Répartition par rayon</div>
                <div className="card__subtitle">Répartition du CA par département</div>
              </div>
            </div>
            {rayonData.length ? (
              <>
                <div style={{ position: 'relative' }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={rayonData} dataKey="ventesTotales" nameKey="nomRayon"
                           cx="50%" cy="50%" outerRadius={78} innerRadius={50}
                           paddingAngle={3} strokeWidth={0}>
                        {rayonData.map((_, i) =>
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        )}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="donut-center">
                    <div className="donut-center__value">{formatAriary(rayonTotal, { compact: true })}</div>
                    <div className="donut-center__label">Total</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', justifyContent: 'center', marginTop: 6 }}>
                  {rayonData.map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#64748b' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                      {r.nomRayon} ({r.pct}%)
                    </div>
                  ))}
                </div>
              </>
            ) : <div className="empty-state">Aucune donnée</div>}
          </div>

          <div className="card">
            <div className="card__header">
              <div>
                <div className="card__title">Dernières commandes</div>
                <div className="card__subtitle">Les commandes les plus récentes</div>
              </div>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>N° Commande</th><th>Montant</th><th>Statut</th></tr></thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.idBonCommande || o.numero}>
                      <td><span className="badge badge-blue">{o.numero}</span></td>
                      <td><CurrencyDisplay value={o.montantBon} size="sm" /></td>
                      <td>{statutBadge(o.statutBon)}</td>
                    </tr>
                  ))}
                  {!orders.length && (
                    <tr><td colSpan={3}><div className="empty-state">Aucune commande</div></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <div>
                <div className="card__title">Alertes & Notifications</div>
                <div className="card__subtitle">{unreadCount > 0 ? `${unreadCount} non lue(s)` : 'Tout est à jour'}</div>
              </div>
              {unreadCount > 0 && (
                <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Tout marquer lu</button>
              )}
            </div>
            <div className="notif-list">
              {notifications.length === 0 ? (
                <div className="empty-state" style={{ padding: '28px 16px' }}>
                  <div className="empty-state__icon">🔔</div>
                  Aucune notification pour le moment
                </div>
              ) : (
                notifications.slice(0, 6).map((n) => (
                  <div className={`notif-item${n.read ? ' notif-item--read' : ''}`} key={n.id}>
                    <div className={`notif-item__icon ${notifTypeClass(n.type)}`}>
                      {notifIcons[n.type] || notifIcons.info}
                    </div>
                    <div className="notif-item__body">
                      <div className="notif-item__title">{n.title}</div>
                      {n.message && <div className="notif-item__msg">{n.message}</div>}
                      <div className="notif-item__meta">{n.meta || ''}</div>
                    </div>
                    {!n.read && <span className="notif-item__dot" />}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <div>
              <div className="card__title">Top 5 vendeurs</div>
              <div className="card__subtitle">Classement par montant de ventes</div>
            </div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr>
                <th>#</th><th>Vendeur</th><th className="text-right">Bons</th><th className="text-right">Ventes</th>
              </tr></thead>
              <tbody>
                {(stats.topVendeurs || []).map((v, i) => (
                  <tr key={v.idVendeur}>
                    <td><span className={`badge ${i === 0 ? 'badge-success' : 'badge-primary'}`}>#{i + 1}</span></td>
                    <td><b>{v.nomVendeur}</b> <span className="text-muted">· {v.codeVendeur}</span></td>
                    <td className="text-right">{v.nombreBonsCommandes}</td>
                    <td className="text-right"><CurrencyDisplay value={v.totalVentes} size="sm" /></td>
                  </tr>
                ))}
                {!stats.topVendeurs?.length && (
                  <tr><td colSpan={4}><div className="empty-state">Aucun vendeur</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
