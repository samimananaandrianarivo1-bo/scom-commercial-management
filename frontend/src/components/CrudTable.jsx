import { useEffect, useState, useCallback } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiSearch, FiDownload, FiFileText, FiGrid, FiFile } from 'react-icons/fi';
import Modal from './Modal.jsx';
import Toast from './Toast.jsx';
import { Link } from 'react-router-dom';
import { exportCSV, exportXLSX, exportPDF } from '../utils/exportUtils';
import { useNotifications } from '../context/NotificationContext.jsx';

/**
 * Composant générique de table CRUD.
 *
 * Props :
 *   service           - { list, create, update, remove }
 *   columns           - [{ key, label, render?, className? }]
 *   idKey             - clé primaire (ex : 'idVendeur')
 *   detailPath        - fonction (row) => '/vendeurs/42' (optionnel)
 *   FormComponent     - composant React (form, setForm, editing) => JSX
 *   emptyForm         - objet initial pour la création
 *   entityLabel       - libellé pour toast / messages
 *   searchable        - champs à filtrer (ex : ['nomVendeur','codeVendeur'])
 *   toolbar           - JSX à placer avant la table (optionnel)
 */
export default function CrudTable({
  service, columns, idKey, detailPath,
  FormComponent, emptyForm, entityLabel = 'Élément',
  searchable = null, toolbar, exportTitle
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [query, setQuery] = useState('');
  const [exportOpen, setExportOpen] = useState(false);
  const { notify } = useNotifications();

  async function reload() {
    setLoading(true); setError(null);
    try {
      const data = await service.list();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Erreur');
    } finally { setLoading(false); }
  }
  useEffect(() => { reload(); /* eslint-disable-next-line */ }, []);

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(row) { setEditing(row); setForm({ ...emptyForm, ...row }); setModalOpen(true); }
  async function submit(e) {
    e.preventDefault();
    try {
      if (editing) {
        await service.update(editing[idKey], form);
        setToast({ type: 'success', title: entityLabel + ' modifié' });
        notify({ type: 'info', title: `${entityLabel} modifié`, message: `Mise à jour de « ${formLabel(form)} »`, meta: "À l'instant" });
      } else {
        await service.create(form);
        setToast({ type: 'success', title: entityLabel + ' créé' });
        notify({ type: 'success', title: `${entityLabel} créé`, message: formLabel(form), meta: "À l'instant" });
      }
      setModalOpen(false); reload();
    } catch (e) {
      setToast({ type: 'error', title: 'Erreur', message: e.message });
    }
  }
  async function remove(row) {
    if (!window.confirm('Confirmer la suppression ?')) return;
    try {
      await service.remove(row[idKey]);
      setToast({ type: 'success', title: 'Supprimé' });
      notify({ type: 'warn', title: `${entityLabel} supprimé`, message: formLabel(row), meta: "À l'instant" });
      reload();
    } catch (e) { setToast({ type: 'error', title: 'Erreur', message: e.message }); }
  }

  function formLabel(row) {
    if (!row) return '';
    const candidate = row.numeroBon || row.codeVendeur || row.nomVendeur || row.codeRayon ||
      row.nomRayon || row.codeCommission || row.codePaiement || row.loginUtilisateur ||
      row.nomUtilisateur;
    return candidate ? String(candidate) : '';
  }

  const filtered = query && searchable ?
    rows.filter(r => searchable.some(k =>
      String(r[k] ?? '').toLowerCase().includes(query.toLowerCase())
    )) : rows;

  const tableColumns = columns.filter(c => c.key !== 'photoUtilisateur');
  const exportColumns = tableColumns.map(c => ({ key: c.key, label: c.label, render: c.render }));
  const title = exportTitle || entityLabel;

  const doExport = useCallback((fmt) => {
    setExportOpen(false);
    const exportData = filtered.map(row => {
      const plain = {};
      tableColumns.forEach(c => {
        if (c.render) {
          const raw = c.render(row);
          if (raw == null) { plain[c.key] = ''; return; }
          if (typeof raw === 'string' || typeof raw === 'number') { plain[c.key] = raw; return; }
          if (raw?.props?.children != null) {
            const ch = raw.props.children;
            plain[c.key] = typeof ch === 'string' || typeof ch === 'number' ? ch
              : Array.isArray(ch) ? ch.map(x => x?.props?.children ?? x ?? '').join(' ')
              : String(ch);
          } else { plain[c.key] = ''; }
        } else {
          plain[c.key] = row[c.key] != null ? row[c.key] : '';
        }
      });
      return plain;
    });
    const plainCols = exportColumns.map(c => ({ key: c.key, label: c.label }));
    if (fmt === 'csv') exportCSV(exportData, plainCols, title);
    else if (fmt === 'xlsx') exportXLSX(exportData, plainCols, title);
    else if (fmt === 'pdf') exportPDF(exportData, plainCols, title, title);
  }, [filtered, tableColumns, exportColumns, title]);

  return (
    <>
      <div className="card">
        <div className="card__header">
          <div className="flex-between gap-2" style={{ flex: 1 }}>
            <div>
              <div className="card__title">Liste des {entityLabel.toLowerCase()}s</div>
              <div className="card__subtitle">{rows.length} enregistrement(s) · Backend Hibernate</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {searchable && (
                <div style={{ position: 'relative' }}>
                  <FiSearch style={{
                    position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                    color: '#94a3b8', fontSize: 14
                  }} />
                  <input className="form-input" placeholder="Rechercher..."
                         style={{ paddingLeft: 32, width: 220 }}
                         value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
              )}
              <div style={{ position: 'relative' }}>
                <button className="btn btn-secondary" onClick={() => setExportOpen(!exportOpen)} title="Exporter les données">
                  <FiDownload size={14} /> Exporter
                </button>
                {exportOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setExportOpen(false)} />
                    <div style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: 4,
                      background: 'white', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                      border: '1px solid #e2e8f0', minWidth: 180, zIndex: 50, padding: 4
                    }}>
                      <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 8, borderRadius: 6, padding: '8px 12px', fontSize: 12.5 }}
                              onClick={() => doExport('csv')}>
                        <FiFileText size={14} /> Exporter CSV
                      </button>
                      <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 8, borderRadius: 6, padding: '8px 12px', fontSize: 12.5 }}
                              onClick={() => doExport('xlsx')}>
                        <FiGrid size={14} /> Exporter Excel
                      </button>
                      <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 8, borderRadius: 6, padding: '8px 12px', fontSize: 12.5 }}
                              onClick={() => doExport('pdf')}>
                        <FiFile size={14} /> Exporter PDF
                      </button>
                    </div>
                  </>
                )}
              </div>
              <button className="btn btn-primary" onClick={openCreate}>
                <FiPlus /> Nouveau
              </button>
            </div>
          </div>
        </div>

        {toolbar}

        {loading ? <div className="spinner" /> : error ? (
          <div className="empty-state">
            <div className="empty-state__icon">⚠️</div>
            <b>Impossible de charger</b>
            <div className="text-muted" style={{ marginTop: 8 }}>{error}</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📭</div>
            Aucun enregistrement
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr>
                {columns.map(c => <th key={c.key} className={c.className}>{c.label}</th>)}
                <th style={{ width: 120 }}>Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(row => (
                  <tr key={row[idKey]}>
                    {columns.map(c => (
                      <td key={c.key} className={c.className}>
                        {c.render ? c.render(row) : (row[c.key] ?? '—')}
                      </td>
                    ))}
                    <td>
                      <div className="table__actions">
                        {detailPath && (
                          <Link className="btn btn-ghost btn-sm" to={detailPath(row)}><FiEye /></Link>
                        )}
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(row)}><FiEdit2 /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => remove(row)}
                                style={{ color: '#ef4444' }}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
             title={(editing ? 'Modifier ' : 'Créer ') + entityLabel.toLowerCase()}
             footer={
               <>
                 <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Annuler</button>
                 <button className="btn btn-primary" onClick={submit}>
                   {editing ? 'Enregistrer' : 'Créer'}
                 </button>
               </>
             }>
        <form onSubmit={submit}>
          <FormComponent form={form} setForm={setForm} editing={editing} />
        </form>
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
