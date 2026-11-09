import { useEffect, useState } from 'react';
import Topbar from '../components/layout/Topbar.jsx';
import CrudTable from '../components/CrudTable.jsx';
import { commissionService } from '../services/commissionService';
import { vendeurService } from '../services/vendeurService';
import { dateFR } from '../utils/format';
import CurrencyDisplay from '../components/common/CurrencyDisplay.jsx';

function Form({ form, setForm, editing }) {
  const [vendeurs, setVendeurs] = useState([]);
  useEffect(() => { vendeurService.list().then(setVendeurs).catch(() => {}); }, []);
  const s = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <>
      <div className="form-row--grid">
        <div className="form-row">
          <label className="form-label">ID *</label>
          <input className="form-input" type="number" required
                 value={form.idCommission || ''} onChange={s('idCommission')} disabled={!!editing} />
        </div>
        <div className="form-row">
          <label className="form-label">Code *</label>
          <input className="form-input" required
                 value={form.codeCommission || ''} onChange={s('codeCommission')} />
        </div>
      </div>
      <div className="form-row--grid">
        <div className="form-row">
          <label className="form-label">Taux (%) *</label>
          <input className="form-input" type="number" step="0.01" required
                 value={form.tauxCommission || ''} onChange={s('tauxCommission')} />
        </div>
        <div className="form-row">
          <label className="form-label">Montant *</label>
          <input className="form-input" type="number" step="0.01" required
                 value={form.montantCommission || ''} onChange={s('montantCommission')} />
        </div>
      </div>
      <div className="form-row--grid">
        <div className="form-row">
          <label className="form-label">Date</label>
          <input className="form-input" type="date"
                 value={form.dateCommission || ''} onChange={s('dateCommission')} />
        </div>
        <div className="form-row">
          <label className="form-label">Vendeur</label>
          <select className="form-select" value={form.idVendeur || ''} onChange={s('idVendeur')}>
            <option value="">—</option>
            {vendeurs.map(v => (
              <option key={v.idVendeur} value={v.idVendeur}>
                {v.nomVendeur} ({v.codeVendeur})
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

export default function Commissions() {
  return (
    <>
      <Topbar title="Commissions" subtitle="Commissions des vendeurs (Hibernate · 8081)" />
      <div className="content">
        <CrudTable
          service={commissionService}
          entityLabel="Commission"
          idKey="idCommission"
          detailPath={(r) => `/commissions/${r.idCommission}`}
          searchable={['codeCommission', 'nomVendeur']}
          columns={[
            { key: 'codeCommission', label: 'Code',
              render: (r) => <span className="badge badge-primary">{r.codeCommission}</span> },
            { key: 'nomVendeur', label: 'Vendeur',
              render: (r) => r.nomVendeur || <span className="text-muted">—</span> },
            { key: 'tauxCommission', label: 'Taux', className: 'text-right',
              render: (r) => <span className="badge badge-warning">{r.tauxCommission}%</span> },
            { key: 'montantCommission', label: 'Montant', className: 'text-right',
              render: (r) => <b><CurrencyDisplay value={r.montantCommission} size="sm" /></b> },
            { key: 'dateCommission', label: 'Date', render: (r) => dateFR(r.dateCommission) },
          ]}
          emptyForm={{ idCommission: '', codeCommission: '', tauxCommission: '',
                       montantCommission: '', dateCommission: '', idVendeur: '' }}
          FormComponent={Form}
        />
      </div>
    </>
  );
}
