import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { FiLogIn } from 'react-icons/fi';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ login: 'admin', password: 'admin123' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await login(form.login, form.password);
      nav(loc.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Impossible de se connecter');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="login-brand">
          <img src="/logo.jpg" alt="SCOM" className="login-brand__logo" />
          <div className="login-brand__title">SCOM</div>
          <div className="login-brand__subtitle">Système de Gestion Commerciale</div>
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="form-row">
          <label className="form-label">Login</label>
          <input className="form-input"
                 value={form.login}
                 onChange={(e) => setForm({ ...form, login: e.target.value })}
                 required autoFocus />
        </div>

        <div className="form-row">
          <label className="form-label">Mot de passe</label>
          <input className="form-input" type="password"
                 value={form.password}
                 onChange={(e) => setForm({ ...form, password: e.target.value })}
                 required />
        </div>

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                disabled={loading}>
          <FiLogIn /> {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        <div className="login-hint">
          <b>Comptes de démonstration</b><br/>
          <code>admin</code> / <code>admin123</code> (ADMIN)<br/>
          <code>manager</code> / <code>manager123</code> (MANAGER)<br/>
          <code>operateur</code> / <code>operateur123</code> (OPERATEUR)
        </div>
      </form>
    </div>
  );
}
