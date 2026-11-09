import { useEffect, useRef, useState } from 'react';
import {
  FiLogOut, FiBell, FiSearch, FiMenu,
  FiAlertTriangle, FiCheckCircle, FiInfo, FiChevronRight
} from 'react-icons/fi';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import Avatar from '../common/Avatar.jsx';

export default function Topbar({ title, subtitle, actions }) {
  const { onToggleSidebar } = useOutletContext();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllRead, markRead, clearAll } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const icons = {
    success: <FiCheckCircle size={15} />,
    warn: <FiAlertTriangle size={15} />,
    info: <FiInfo size={15} />,
  };

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="topbar__hamburger" onClick={onToggleSidebar}>
          <FiMenu size={20} />
        </button>
        <div>
          <div className="topbar__title">{title}</div>
          {subtitle && <div className="topbar__subtitle">{subtitle}</div>}
        </div>
      </div>

      <div className="topbar__actions">
        <div className="topbar__search">
          <FiSearch size={16} />
          <input type="text" placeholder="Rechercher une fonctionnalité..." />
        </div>

        {actions}

        <div className="topbar__notif-wrap" ref={notifRef}>
          <button
            className={`topbar__notif${notifOpen ? ' topbar__notif--open' : ''}`}
            title="Notifications"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <FiBell size={18} />
            {unreadCount > 0 && <span className="topbar__notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </button>

          {notifOpen && (
            <>
              <div className="notif-dropdown__scrim" onClick={() => setNotifOpen(false)} />
              <div className="notif-dropdown">
                <div className="notif-dropdown__header">
                  <div>
                    <div className="notif-dropdown__title">Notifications</div>
                    <div className="notif-dropdown__subtitle">
                      {unreadCount > 0 ? `${unreadCount} non lue(s)` : 'Tout est à jour'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {notifications.length > 0 && (
                      <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Tout lu</button>
                    )}
                    {notifications.length > 0 && (
                      <button className="btn btn-ghost btn-sm" onClick={clearAll} style={{ color: '#ef4444' }}>Effacer</button>
                    )}
                  </div>
                </div>

                <div className="notif-dropdown__list">
                  {notifications.length === 0 ? (
                    <div className="empty-state" style={{ padding: '32px 16px' }}>
                      <div className="empty-state__icon">🔔</div>
                      Aucune notification
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`notif-item${n.read ? ' notif-item--read' : ' notif-item--unread'}`}
                        onClick={() => markRead(n.id)}
                      >
                        <div className={`notif-item__icon${n.type === 'warn' ? ' notif-item__icon--warn' : n.type === 'success' ? ' notif-item__icon--success' : ' notif-item__icon--info'}`}>
                          {icons[n.type] || icons.info}
                        </div>
                        <div className="notif-item__body">
                          <div className="notif-item__title">{n.title}</div>
                          {n.message && <div className="notif-item__msg">{n.message}</div>}
                          <div className="notif-item__meta">{n.meta || ''}</div>
                        </div>
                        {!n.read && <span className="notif-item__dot" />}
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="notif-dropdown__footer">
                    <button className="btn btn-secondary btn-sm" onClick={() => setNotifOpen(false)}>
                      Fermer <FiChevronRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="topbar__divider" />

        <div className="topbar__user">
          <Avatar
            photo={user?.photoUtilisateur}
            name={user?.nomUtilisateur || user?.loginUtilisateur || 'U'}
            size={32}
            radius={8}
          />
          <div className="topbar__user-info">
            <div className="topbar__user-name">{user?.nomUtilisateur || user?.loginUtilisateur || 'Utilisateur'}</div>
            <div className="topbar__user-role">{user?.roleUtilisateur || 'INVITE'}</div>
          </div>
        </div>

        <button className="topbar__logout" onClick={logout} title="Se déconnecter">
          <FiLogOut size={16} />
        </button>
      </div>
    </header>
  );
}