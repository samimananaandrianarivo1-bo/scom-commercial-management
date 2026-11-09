import { useState, useRef } from 'react';
import Topbar from '../components/layout/Topbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from '../components/common/Avatar.jsx';
import { resizeImage } from '../utils/resizeImage';
import { FiCamera, FiTrash2 } from 'react-icons/fi';

export default function Parametres() {
  const { user, updatePhoto } = useAuth();
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);
  const fileRef = useRef();

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setMsg({ type: 'error', text: 'Veuillez sélectionner une image' }); return; }
    if (file.size > 5 * 1024 * 1024) { setMsg({ type: 'error', text: 'Image trop volumineuse (max 5 Mo)' }); return; }
    try {
      setMsg(null);
      const base64 = await resizeImage(file, { maxSize: 200, quality: 0.85 });
      setPreview(base64);
    } catch { setMsg({ type: 'error', text: 'Erreur lors du traitement de l\'image' }); }
  }

  async function savePhoto() {
    if (!preview) return;
    setUploading(true); setMsg(null);
    try {
      await updatePhoto(preview);
      setPreview(null);
      setMsg({ type: 'success', text: 'Photo mise à jour avec succès' });
    } catch { setMsg({ type: 'error', text: 'Erreur lors de la sauvegarde' }); }
    finally { setUploading(false); }
  }

  async function removePhoto() {
    setUploading(true); setMsg(null);
    try {
      await updatePhoto(null);
      setPreview(null);
      setMsg({ type: 'success', text: 'Photo supprimée' });
    } catch { setMsg({ type: 'error', text: 'Erreur lors de la suppression' }); }
    finally { setUploading(false); }
  }

  const displayPhoto = preview || user?.photoUtilisateur;

  return (
    <>
      <Topbar title="Paramètres" subtitle="Configuration du système" />
      <div className="content">
        <div className="grid-2">
          <div className="card">
            <div className="card__header"><div className="card__title">Photo de profil</div></div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <Avatar photo={displayPhoto} name={user?.nomUtilisateur || user?.loginUtilisateur || 'U'} size={120} radius={20} fontSize={40} />
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  <FiCamera /> Choisir une photo
                </button>
                {user?.photoUtilisateur && (
                  <button className="btn btn-danger" onClick={removePhoto} disabled={uploading}>
                    <FiTrash2 /> Supprimer
                  </button>
                )}
              </div>
              {preview && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-success" onClick={savePhoto} disabled={uploading}>
                    {uploading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button className="btn btn-ghost" onClick={() => setPreview(null)} disabled={uploading}>Annuler</button>
                </div>
              )}
              {msg && <div className={msg.type === 'error' ? 'login-error' : 'login-success'}>{msg.text}</div>}
            </div>
          </div>

          <div className="card">
            <div className="card__header"><div className="card__title">Utilisateur connecté</div></div>
            <p><b>Login :</b> {user?.loginUtilisateur}</p>
            <p><b>Nom :</b> {user?.nomUtilisateur || '—'}</p>
            <p><b>Email :</b> {user?.emailUtilisateur || '—'}</p>
            <p><b>Rôle :</b> <span className="badge badge-primary">{user?.roleUtilisateur || '—'}</span></p>
          </div>
        </div>

        <div className="card">
          <div className="card__header"><div className="card__title">Backends</div></div>
          <p><b>Backend Hibernate :</b> <code className="text-mono">http://localhost:8081</code></p>
          <p>Swagger : <a href="http://localhost:8081/swagger-ui/index.html" target="_blank" rel="noreferrer">
            /swagger-ui</a></p>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '12px 0' }} />
          <p><b>Backend JPA :</b> <code className="text-mono">http://localhost:8082</code></p>
          <p>Swagger : <a href="http://localhost:8082/swagger-ui/index.html" target="_blank" rel="noreferrer">
            /swagger-ui</a></p>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '12px 0' }} />
          <p><b>Base de données :</b> <code className="text-mono">db_scom_database</code></p>
          <p><b>SGBD :</b> MySQL @ localhost:3306 (WAMP)</p>
        </div>

        <div className="card">
          <div className="card__header"><div className="card__title">À propos</div></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
            <img src="/logo.jpg" alt="SCOM" style={{
              width: 64, height: 64, borderRadius: 14, objectFit: 'cover',
              border: '2px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>SCOM — Système de Gestion Commerciale</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Application 100 % locale/offline</div>
            </div>
          </div>
          <ul style={{ lineHeight: 2, color: '#475569' }}>
            <li><b>Backend Hibernate</b> — Spring Boot 3 + Hibernate ORM (JDK 25, port 8081)</li>
            <li><b>Backend JPA</b> — Spring Boot 3 + Spring Data JPA (JDK 25, port 8082)</li>
            <li><b>Frontend</b> React 18 + Vite + Recharts (port 5173)</li>
            <li><b>Base de données</b> MySQL locale via WAMP</li>
          </ul>
        </div>
      </div>
    </>
  );
}
