import Topbar from '../components/layout/Topbar.jsx';
import CrudTable from '../components/CrudTable.jsx';
import { vendeurService } from '../services/vendeurService';

function Form({ form, setForm, editing }) {
  const s = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <>
      <div className="form-row--grid">
        <div className="form-row">
          <label className="form-label">ID vendeur *</label>
          <input className="form-input" type="number" required
                 value={form.idVendeur || ''} onChange={s('idVendeur')} disabled={!!editing} />
        </div>
        <div className="form-row">
          <label className="form-label">Code *</label>
          <input className="form-input" required
                 value={form.codeVendeur || ''} onChange={s('codeVendeur')} />
        </div>
      </div>
      <div className="form-row--grid">
        <div className="form-row">
          <label className="form-label">Nom *</label>
          <input className="form-input" required
                 value={form.nomVendeur || ''} onChange={s('nomVendeur')} />
        </div>
        <div className="form-row">
          <label className="form-label">Prénom</label>
          <input className="form-input"
                 value={form.prenomVendeur || ''} onChange={s('prenomVendeur')} />
        </div>
      </div>
      <div className="form-row">
        <label className="form-label">Email</label>
        <input className="form-input" type="email"
               value={form.emailVendeur || ''} onChange={s('emailVendeur')} />
      </div>
      <div className="form-row--grid">
        <div className="form-row">
          <label className="form-label">Téléphone</label>
          <input className="form-input"
                 value={form.telephoneVendeur || ''} onChange={s('telephoneVendeur')} />
        </div>
        <div className="form-row">
          <label className="form-label">Adresse</label>
          <input className="form-input"
                 value={form.adresseVendeur || ''} onChange={s('adresseVendeur')} />
        </div>
      </div>
    </>
  );
}

export default function Vendeurs() {
  return (
    <>
      <Topbar title="Vendeurs" subtitle="Gestion des vendeurs (Hibernate · port 8081)" />
      <div className="content">
        <CrudTable
          service={vendeurService}
          entityLabel="Vendeur"
          idKey="idVendeur"
          detailPath={(r) => `/vendeurs/${r.idVendeur}`}
          searchable={['nomVendeur', 'codeVendeur', 'prenomVendeur', 'emailVendeur']}
          columns={[
            { key: 'codeVendeur', label: 'Code',
              render: (r) => <span className="badge badge-primary">{r.codeVendeur}</span> },
            { key: 'nomVendeur',    label: 'Nom',    render: (r) => <b>{r.nomVendeur}</b> },
            { key: 'prenomVendeur', label: 'Prénom' },
            { key: 'emailVendeur',  label: 'Email',    render: (r) => r.emailVendeur || <span className="text-muted">—</span> },
            { key: 'telephoneVendeur', label: 'Téléphone' },
            { key: 'nombreBonsCommandes', label: 'Bons',
              render: (r) => <span className="badge badge-gray">{r.nombreBonsCommandes ?? 0}</span> },
            { key: 'nombreRayons',  label: 'Rayons',
              render: (r) => <span className="badge badge-success">{r.nombreRayons ?? 0}</span> },
          ]}
          emptyForm={{ idVendeur: '', codeVendeur: '', nomVendeur: '', prenomVendeur: '',
                       emailVendeur: '', telephoneVendeur: '', adresseVendeur: '' }}
          FormComponent={Form}
        />
      </div>
    </>
  );
}
