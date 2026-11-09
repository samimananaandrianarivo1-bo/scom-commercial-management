import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Topbar from '../components/layout/Topbar.jsx';
import { commissionService } from '../services/commissionService';
import { dateFR } from '../utils/format';
import CurrencyDisplay from '../components/common/CurrencyDisplay.jsx';

export default function CommissionDetail() {
  const { id } = useParams();
  const [c, setC] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => { commissionService.get(id).then(setC).catch(e => setError(e.message)); }, [id]);

  return (
    <>
      <Topbar title="Détail commission" subtitle={'ID : ' + id} />
      <div className="content">
        <Link to="/commissions" className="btn btn-secondary" style={{ marginBottom: 16 }}>
          <FiArrowLeft /> Retour
        </Link>
        {error && <div className="card"><div className="empty-state">⚠️ {error}</div></div>}
        {c && (
          <div className="card">
            <div className="card__header">
              <div>
                <div className="card__title">{c.codeCommission}</div>
                <div className="card__subtitle">Vendeur : {c.nomVendeur || '—'}</div>
              </div>
              <span className="badge badge-warning">Taux {c.tauxCommission}%</span>
            </div>
            <div className="grid-2">
              <div>
                <div className="text-muted mb-2" style={{ fontSize: 11, textTransform: 'uppercase' }}>Date</div>
                <div><b>{dateFR(c.dateCommission)}</b></div>
              </div>
              <div>
                <div className="text-muted mb-2" style={{ fontSize: 11, textTransform: 'uppercase' }}>Montant</div>
                <div style={{ whiteSpace: 'nowrap' }}><CurrencyDisplay value={c.montantCommission} size="lg" /></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
