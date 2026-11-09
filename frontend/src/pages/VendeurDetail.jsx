import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import Topbar from '../components/layout/Topbar.jsx';
import { vendeurService } from '../services/vendeurService';

export default function VendeurDetail() {
  const { id } = useParams();
  const [v, setV] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    vendeurService.get(id).then(setV).catch(e => setError(e.message));
  }, [id]);

  return (
    <>
      <Topbar title="Détail vendeur" subtitle={'ID : ' + id} />
      <div className="content">
        <Link to="/vendeurs" className="btn btn-secondary" style={{ marginBottom: 16 }}>
          <FiArrowLeft /> Retour
        </Link>
        {error && <div className="card"><div className="empty-state">⚠️ {error}</div></div>}
        {v && (
          <div className="card">
            <div className="card__header">
              <div>
                <div className="card__title">{v.nomVendeur} {v.prenomVendeur}</div>
                <div className="card__subtitle">Code : {v.codeVendeur}</div>
              </div>
              <span className="badge badge-primary">Vendeur</span>
            </div>
            <div className="grid-2">
              <div>
                <div className="mb-2 text-muted" style={{ fontSize: 11, textTransform: 'uppercase' }}>Contact</div>
                <div className="mb-2"><FiMail /> {v.emailVendeur || '—'}</div>
                <div className="mb-2"><FiPhone /> {v.telephoneVendeur || '—'}</div>
                <div><FiMapPin /> {v.adresseVendeur || '—'}</div>
              </div>
              <div>
                <div className="mb-2 text-muted" style={{ fontSize: 11, textTransform: 'uppercase' }}>Activité</div>
                <div className="mb-2"><b>{v.nombreBonsCommandes ?? 0}</b> bon(s) de commande</div>
                <div className="mb-2"><b>{v.nombreCommissions ?? 0}</b> commission(s)</div>
                <div><b>{v.nombreRayons ?? 0}</b> rayon(s) exploité(s)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
