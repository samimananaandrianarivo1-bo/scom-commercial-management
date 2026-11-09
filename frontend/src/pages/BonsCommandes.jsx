import { useEffect, useState } from 'react';
import Topbar from '../components/layout/Topbar.jsx';
import CrudTable from '../components/CrudTable.jsx';
import { bonCommandeService } from '../services/bonCommandeService';
import { vendeurService } from '../services/vendeurService';
import { dateFR } from '../utils/format';
import CurrencyDisplay from '../components/common/CurrencyDisplay.jsx';

const STATUTS = ['EN_COURS', 'PAYE', 'ANNULE'];

function useVendeurs() {
  const [list, setList] = useState([]);
  useEffect(() => { vendeurService.list().then(setList).catch(() => {}); }, []);
  return list;
}

function Form({ form, setForm, editing }) {
  const vendeurs = useVendeurs();
  const s = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <>
      <div className="form-row--grid">
        <div className="form-row">
          <label className="form-label">ID *</label>
          <input className="form-input" type="number" required
                 value={form.idBonCommande || ''} onChange={s('idBonCommande')} disabled={!!editing} />
        </div>
        <div className="form-row">
          <label className="form-label">Numéro *</label>
          <input className="form-input" required
                 value={form.numeroBon || ''} onChange={s('numeroBon')} />
        </div>
      </div>
      <div className="form-row--grid">
        <div className="form-row">
          <label className="form-label">Date *</label>
          <input className="form-input" type="date" required
                 value={form.dateBon || ''} onChange={s('dateBon')} />
        </div>
        <div className="form-row">
          <label className="form-label">Montant *</label>
          <input className="form-input" type="number" step="0.01" required
                 value={form.montantBon || ''} onChange={s('montantBon')} />
        </div>
      </div>
      <div className="form-row--grid">
        <div className="form-row">
          <label className="form-label">Statut</label>
          <select className="form-select" value={form.statutBon || ''} onChange={s('statutBon')}>
            <option value="">—</option>
            {STATUTS.map(x => <option key={x} value={x}>{x}</option>)}
          </select>
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

export default function BonsCommandes() {
  return (
    <>
      <Topbar title="Bons de commande" subtitle="Gestion des bons (Hibernate · 8081)" />
      <div className="content">
        <CrudTable
          service={bonCommandeService}
          entityLabel="Bon de commande"
          idKey="idBonCommande"
          detailPath={(r) => `/bons-commandes/${r.idBonCommande}`}
          searchable={['numeroBon', 'nomVendeur', 'statutBon']}
          columns={[
            { key: 'numeroBon', label: 'Numéro',
              render: (r) => <span className="badge badge-primary">{r.numeroBon}</span> },
            { key: 'dateBon', label: 'Date', render: (r) => dateFR(r.dateBon) },
            { key: 'nomVendeur', label: 'Vendeur',
              render: (r) => r.nomVendeur || <span className="text-muted">—</span> },
            { key: 'montantBon', label: 'Montant', className: 'text-right',
              render: (r) => <b><CurrencyDisplay value={r.montantBon} size="sm" /></b> },
            { key: 'statutBon', label: 'Statut',
              render: (r) => {
                const cls = r.statutBon === 'PAYE' ? 'success'
                          : r.statutBon === 'ANNULE' ? 'danger'
                          : r.statutBon === 'EN_COURS' ? 'warning' : 'gray';
                return <span className={'badge badge-' + cls}>{r.statutBon || '—'}</span>;
              }},
          ]}
          emptyForm={{ idBonCommande: '', numeroBon: '', dateBon: '',
                       montantBon: '', statutBon: 'EN_COURS', idVendeur: '' }}
          FormComponent={Form}
        />
      </div>
    </>
  );
}
