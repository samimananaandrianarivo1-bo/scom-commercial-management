import { useEffect, useState } from 'react';
import Topbar from '../components/layout/Topbar.jsx';
import { vendeurService } from '../services/vendeurService';
import { rayonService } from '../services/rayonService';
import { nombre } from '../utils/format';
import { formatAriary } from '../utils/formatCurrency';
import CurrencyDisplay from '../components/common/CurrencyDisplay.jsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function Rapports() {
  const [classement, setClassement] = useState([]);
  const [rayons, setRayons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([vendeurService.classement(), rayonService.statistiques()])
      .then(([c, r]) => { setClassement(c); setRayons(r); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Topbar title="Rapports & Statistiques" subtitle="Analyse avancée (backend JPA · port 8082)" />
      <div className="content">
        {loading ? <div className="spinner" /> : error ? (
          <div className="card"><div className="empty-state">⚠️ {error}</div></div>
        ) : (
          <>
            <div className="card">
              <div className="card__header">
                <div>
                  <div className="card__title">Classement des vendeurs</div>
                  <div className="card__subtitle">Trié par montant de ventes décroissant</div>
                </div>
              </div>
              {classement.length > 0 && (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={classement.slice(0, 10)}>
                    <CartesianGrid stroke="#f1f5f9" />
                    <XAxis dataKey="nomVendeur" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => formatAriary(v)} />
                    <Legend />
                    <Bar dataKey="totalVentes" name="Ventes" fill="#1d4ed8" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="totalCommissions" name="Commissions" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              <div className="table-wrap" style={{ marginTop: 16 }}>
                <table className="table">
                  <thead><tr>
                    <th>#</th><th>Code</th><th>Nom</th>
                    <th className="text-right">Bons</th>
                    <th className="text-right">Ventes</th>
                    <th className="text-right">Commissions</th>
                  </tr></thead>
                  <tbody>
                    {classement.map((v, i) => (
                      <tr key={v.idVendeur}>
                        <td><span className="badge badge-primary">#{i + 1}</span></td>
                        <td>{v.codeVendeur}</td>
                        <td><b>{v.nomVendeur}</b></td>
                        <td className="text-right">{nombre(v.nombreBonsCommandes)}</td>
                        <td className="text-right"><CurrencyDisplay value={v.totalVentes} size="sm" /></td>
                        <td className="text-right"><CurrencyDisplay value={v.totalCommissions} size="sm" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="card__header">
                <div>
                  <div className="card__title">Performance par rayon</div>
                  <div className="card__subtitle">Nombre de vendeurs et volume de ventes</div>
                </div>
              </div>
              <div className="table-wrap">
                <table className="table">
                  <thead><tr>
                    <th>Rayon</th>
                    <th className="text-right">Vendeurs</th>
                    <th className="text-right">Ventes totales</th>
                  </tr></thead>
                  <tbody>
                    {rayons.map(r => (
                      <tr key={r.idRayon}>
                        <td><b>{r.nomRayon}</b></td>
                        <td className="text-right">
                          <span className="badge badge-primary">{nombre(r.nombreVendeurs)}</span>
                        </td>
                        <td className="text-right"><CurrencyDisplay value={r.ventesTotales} size="sm" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
