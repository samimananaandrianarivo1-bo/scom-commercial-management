import Topbar from '../components/layout/Topbar.jsx';
import CrudTable from '../components/CrudTable.jsx';
import { rayonService } from '../services/rayonService';

function Form({ form, setForm, editing }) {
  const s = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <>
      <div className="form-row--grid">
        <div className="form-row">
          <label className="form-label">ID rayon *</label>
          <input className="form-input" type="number" required
                 value={form.idRayon || ''} onChange={s('idRayon')} disabled={!!editing} />
        </div>
        <div className="form-row">
          <label className="form-label">Code *</label>
          <input className="form-input" required
                 value={form.codeRayon || ''} onChange={s('codeRayon')} />
        </div>
      </div>
      <div className="form-row">
        <label className="form-label">Nom *</label>
        <input className="form-input" required
               value={form.nomRayon || ''} onChange={s('nomRayon')} />
      </div>
      <div className="form-row">
        <label className="form-label">Description</label>
        <textarea className="form-textarea"
                  value={form.descriptionRayon || ''} onChange={s('descriptionRayon')} />
      </div>
    </>
  );
}

export default function Rayons() {
  return (
    <>
      <Topbar title="Rayons" subtitle="Départements commerciaux (Hibernate · 8081)" />
      <div className="content">
        <CrudTable
          service={rayonService}
          entityLabel="Rayon"
          idKey="idRayon"
          searchable={['nomRayon', 'codeRayon']}
          columns={[
            { key: 'codeRayon', label: 'Code',
              render: (r) => <span className="badge badge-primary">{r.codeRayon}</span> },
            { key: 'nomRayon', label: 'Nom', render: (r) => <b>{r.nomRayon}</b> },
            { key: 'descriptionRayon', label: 'Description',
              render: (r) => <span className="text-muted">{r.descriptionRayon || '—'}</span> },
            { key: 'nombreVendeurs', label: 'Vendeurs',
              render: (r) => <span className="badge badge-success">{r.nombreVendeurs ?? 0}</span> },
          ]}
          emptyForm={{ idRayon: '', codeRayon: '', nomRayon: '', descriptionRayon: '' }}
          FormComponent={Form}
        />
      </div>
    </>
  );
}
