import { NavLink } from 'react-router-dom';
import {
  FiHome, FiUsers, FiGrid, FiFileText, FiCreditCard,
  FiBarChart2, FiSettings, FiLogOut, FiBell, FiSearch,
  FiMenu, FiAlertTriangle, FiCheckCircle, FiChevronRight,
  FiClock, FiTrendingUp, FiLogOut as FiLogOut2
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';
import Avatar from '../common/Avatar.jsx';

const menu = [
  { section: 'Tableau de bord' },
  { to: '/dashboard', label: 'Dashboard', icon: <FiHome size={18} /> },

  { section: 'Gestion Commerciale' },
  { to: '/vendeurs',       label: 'Vendeurs',          icon: <FiUsers size={18} /> },
  { to: '/rayons',         label: 'Rayons',            icon: <FiGrid size={18} /> },
  { to: '/bons-commandes', label: 'Bons de commande',  icon: <FiFileText size={18} /> },
  { to: '/commissions',    label: 'Commissions',       icon: <FiCreditCard size={18} /> },

  { section: 'Finances' },
  { to: '/paiements',     label: 'Paiements',         icon: <FiCreditCard size={18} /> },

  { section: 'Système' },
  { to: '/utilisateurs',  label: 'Utilisateurs',      icon: <FiUsers size={18} /> },
  { to: '/rapports',      label: 'Rapports & Stats',  icon: <FiBarChart2 size={18} /> },
  { to: '/parametres',    label: 'Paramètres',        icon: <FiSettings size={18} /> },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      <div className={`sidebar-overlay ${open ? 'active' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar__brand">
          <img src="/logo.jpg" alt="SCOM" className="sidebar__brand-logo" />
          <div>
            <div className="sidebar__brand-title">SCOM</div>
            <div className="sidebar__brand-subtitle">Gestion Commerciale</div>
          </div>
        </div>

        <nav className="sidebar__nav">
          {menu.map((l, i) => l.section ? (
            <div key={`s-${i}`} className="sidebar__nav-section">{l.section}</div>
          ) : (
            <NavLink key={l.to} to={l.to} onClick={onClose}
              className={({ isActive }) => 'sidebar__link' + (isActive ? ' active' : '')}>
              {l.icon}<span>{l.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <Avatar
              photo={user?.photoUtilisateur}
              name={user?.nomUtilisateur || user?.loginUtilisateur || 'U'}
              size={34}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar__user-name">
                {user?.nomUtilisateur || user?.loginUtilisateur || 'Utilisateur'}
                <span className="sidebar__user-status" />
              </div>
              <div className="sidebar__user-role">{user?.roleUtilisateur || 'INVITE'}</div>
            </div>
          </div>
          <button className="sidebar__logout" onClick={logout}>
            <FiLogOut size={14} />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
