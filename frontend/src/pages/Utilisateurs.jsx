import Topbar from '../components/layout/Topbar.jsx';
import CrudTable from '../components/CrudTable.jsx';
import Avatar from '../components/common/Avatar.jsx';
import { utilisateurService } from '../services/utilisateurService';

const ROLES = ['ADMIN', 'MANAGER', 'OPERATEUR'];

function Form({ form, setForm, editing }) {
  const s = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <>
      <div className="form-row--grid">
        <div className="form-row">
          <label className="form-label">ID *</label>
          <input className="form-input" type="number" required
                 value={form.idUtilisateur || ''} onChange={s('idUtilisateur')} disabled={!!editing} />
        </div>
        <div className="form-row">
          <label className="form-label">Login *</label>
          <input className="form-input" required
                 value={form.loginUtilisateur || ''} onChange={s('loginUtilisateur')} />
        </div>
      </div>
      <div className="form-row">
        <label className="form-label">Mot de passe {editing && <span className="text-muted">(laisser vide pour ne pas changer)</span>}</label>
        <input className="form-input" type="password"
               value={form.passwordUtilisateur || ''} onChange={s('passwordUtilisateur')} />
      </div>
      <div className="form-row--grid">
        <div className="form-row">
          <label className="form-label">Nom</label>
          <input className="form-input"
                 value={form.nomUtilisateur || ''} onChange={s('nomUtilisateur')} />
        </div>
        <div className="form-row">
          <label className="form-label">Email</label>
          <input className="form-input" type="email"
                 value={form.emailUtilisateur || ''} onChange={s('emailUtilisateur')} />
        </div>
      </div>
      <div className="form-row">
        <label className="form-label">Rôle</label>
        <select className="form-select" value={form.roleUtilisateur || ''} onChange={s('roleUtilisateur')}>
          <option value="">—</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
    </>
  );
}

export default function Utilisateurs() {
  return (
    <>
      <Topbar title="Utilisateurs" subtitle="Comptes locaux (Hibernate · 8081)" />
      <div className="content">
        <CrudTable
          service={utilisateurService}
          entityLabel="Utilisateur"
          idKey="idUtilisateur"
          searchable={['loginUtilisateur', 'nomUtilisateur', 'emailUtilisateur']}
          columns={[
            { key: 'photoUtilisateur', label: 'Photo', width: 60,
              render: (r) => <Avatar photo={r.photoUtilisateur} name={r.nomUtilisateur || r.loginUtilisateur} size={34} radius={8} fontSize={12} /> },
            { key: 'loginUtilisateur', label: 'Login',
              render: (r) => <b>{r.loginUtilisateur}</b> },
            { key: 'nomUtilisateur', label: 'Nom' },
            { key: 'emailUtilisateur', label: 'Email',
              render: (r) => r.emailUtilisateur || <span className="text-muted">—</span> },
            { key: 'roleUtilisateur', label: 'Rôle',
              render: (r) => {
                const cls = r.roleUtilisateur === 'ADMIN' ? 'danger'
                          : r.roleUtilisateur === 'MANAGER' ? 'primary' : 'gray';
                return <span className={'badge badge-' + cls}>{r.roleUtilisateur || '—'}</span>;
              }},
          ]}
          emptyForm={{ idUtilisateur: '', loginUtilisateur: '', passwordUtilisateur: '',
                       nomUtilisateur: '', emailUtilisateur: '', roleUtilisateur: 'OPERATEUR' }}
          FormComponent={Form}
        />
      </div>
    </>
  );
}
