import Topbar from '../components/layout/Topbar.jsx';
import CrudTable from '../components/CrudTable.jsx';
import { paiementService } from '../services/paiementService';
import { dateFR } from '../utils/format';
import CurrencyDisplay from '../components/common/CurrencyDisplay.jsx';

const MODES = ['ESPECES', 'CB', 'VIREMENT', 'CHEQUE'];

function Form({ form, setForm, editing }) {
  const s = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <>
      <div className="form-row--grid">
        <div className="form-row">
          <label className="form-label">ID *</label>
          <input className="form-input" type="number" required
                 value={form.idPaiement || ''} onChange={s('idPaiement')} disabled={!!editing} />
        </div>
        <div className="form-row">
          <label className="form-label">Code *</label>
          <input className="form-input" required
                 value={form.codePaiement || ''} onChange={s('codePaiement')} />
        </div>
      </div>
      <div className="form-row--grid">
        <div className="form-row">
          <label className="form-label">Mode *</label>
          <select className="form-select" required value={form.modePaiement || ''} onChange={s('modePaiement')}>
            <option value="">—</option>
            {MODES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label className="form-label">Montant *</label>
          <input className="form-input" type="number" step="0.01" required
                 value={form.montantPaiement || ''} onChange={s('montantPaiement')} />
        </div>
      </div>
      <div className="form-row">
        <label className="form-label">Date</label>
        <input className="form-input" type="date"
               value={form.datePaiement || ''} onChange={s('datePaiement')} />
      </div>
    </>
  );
}

export default function Paiements() {
  return (
    <>
      <Topbar title="Paiements" subtitle="Encaissements (Hibernate · 8081)" />
      <div className="content">
        <CrudTable
          service={paiementService}
          entityLabel="Paiement"
          idKey="idPaiement"
          searchable={['codePaiement', 'modePaiement']}
          columns={[
            { key: 'codePaiement', label: 'Code',
              render: (r) => <span className="badge badge-primary">{r.codePaiement}</span> },
            { key: 'modePaiement', label: 'Mode',
              render: (r) => <span className="badge badge-gray">{r.modePaiement}</span> },
            { key: 'montantPaiement', label: 'Montant', className: 'text-right',
              render: (r) => <b><CurrencyDisplay value={r.montantPaiement} size="sm" /></b> },
            { key: 'datePaiement', label: 'Date', render: (r) => dateFR(r.datePaiement) },
          ]}
          emptyForm={{ idPaiement: '', codePaiement: '', modePaiement: 'ESPECES',
                       montantPaiement: '', datePaiement: '' }}
          FormComponent={Form}
        />
      </div>
    </>
  );
}
