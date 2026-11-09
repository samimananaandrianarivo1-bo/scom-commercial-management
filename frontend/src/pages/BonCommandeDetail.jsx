import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Topbar from '../components/layout/Topbar.jsx';
import { bonCommandeService } from '../services/bonCommandeService';
import { dateFR } from '../utils/format';
import CurrencyDisplay from '../components/common/CurrencyDisplay.jsx';

export default function BonCommandeDetail() {
  const { id } = useParams();
  const [b, setB] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { bonCommandeService.get(id).then(setB).catch(e => setError(e.message)); }, [id]);

  return (
    <>
      <Topbar title="Détail bon de commande" subtitle={'ID : ' + id} />
      <div className="content">
        <Link to="/bons-commandes" className="btn btn-secondary" style={{ marginBottom: 16 }}>
          <FiArrowLeft /> Retour
        </Link>
        {error && <div className="card"><div className="empty-state">⚠️ {error}</div></div>}
        {b && (
          <div className="card">
            <div className="card__header">
              <div>
                <div className="card__title">{b.numeroBon}</div>
                <div className="card__subtitle">Émis le {dateFR(b.dateBon)}</div>
              </div>
              <span className={'badge badge-' + (b.statutBon === 'PAYE' ? 'success' : 'warning')}>{b.statutBon}</span>
            </div>
            <div className="grid-2">
              <div>
                <div className="text-muted mb-2" style={{ fontSize: 11, textTransform: 'uppercase' }}>Vendeur</div>
                <div><b>{b.nomVendeur || '—'}</b></div>
              </div>
              <div>
                <div className="text-muted mb-2" style={{ fontSize: 11, textTransform: 'uppercase' }}>Montant</div>
                <div style={{ whiteSpace: 'nowrap' }}><CurrencyDisplay value={b.montantBon} size="lg" /></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
