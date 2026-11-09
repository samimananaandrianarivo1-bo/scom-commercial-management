import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { bonCommandeService } from '../services/bonCommandeService';
import { paiementService } from '../services/paiementService';
import { dashboardService } from '../services/dashboardService';

const NotificationContext = createContext(null);

const NOTIF_KEY = 'scom_notifications';
const SEEN_KEY = 'scom_seen_bons';
const SEEN_PAIEMENTS = 'scom_seen_paiements';

function loadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function saveStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

function timeAgo(dateISO) {
  const diff = Date.now() - new Date(dateISO).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `Il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'Hier';
  return `Il y a ${d} jours`;
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => loadStorage(NOTIF_KEY, []));
  const [loaded, setLoaded] = useState(false);
  const firstRun = useRef(true);

  const notify = useCallback(({ type = 'info', title, message = '', meta = '', dataRef = null }) => {
    setNotifications(prev => {
      const next = [{
        id: `${Date.now()}`,
        type, title, message, meta,
        dataRef: dataRef ? JSON.stringify(dataRef) : null,
        read: false,
        date: new Date().toISOString(),
      }, ...prev].slice(0, 30);
      saveStorage(NOTIF_KEY, next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      saveStorage(NOTIF_KEY, next);
      return next;
    });
  }, []);

  const markRead = useCallback((id) => {
    setNotifications(prev => {
      const next = prev.map(n => n.id === id ? { ...n, read: true } : n);
      saveStorage(NOTIF_KEY, next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    saveStorage(NOTIF_KEY, []);
  }, []);

  /* ── Détection d'événements réels depuis les backends ── */
  useEffect(() => {
    if (!loaded) return;

    const seenBons = loadStorage(SEEN_KEY, null);
    const seenPaiments = loadStorage(SEEN_PAIEMENTS, null);

    async function scan() {
      try {
        const [bons, paiements] = await Promise.all([
          bonCommandeService.list().catch(() => []),
          paiementService.list().catch(() => []),
        ]);

        // Nouveaux bons de commande
        if (seenBons !== null && Array.isArray(bons)) {
          const newBons = bons
            .filter(b => !seenBons.includes(String(b.idBonCommande)))
            .slice(0, 5);
          newBons.forEach(b => {
            const stale = new Date(b.dateBon) && (Date.now() - new Date(b.dateBon).getTime()) < 24 * 3600 * 1000;
            if (stale || b.dateBon) {
              notify({
                type: b.statutBon === 'PAYE' ? 'success' : 'info',
                title: `Nouveau bon de commande ${b.numeroBon || b.idBonCommande}`,
                message: b.nomVendeur ? `Par ${b.nomVendeur}` : '',
                meta: b.dateBon ? timeAgo(new Date(b.dateBon).toISOString()) : '',
              });
            }
          });
        }

        // Nouveaux paiements
        if (seenPaiments !== null && Array.isArray(paiements)) {
          const newPaiments = paiements
            .filter(p => !seenPaiments.includes(String(p.idPaiement)))
            .slice(0, 5);
          newPaiments.forEach(p => {
            notify({
              type: 'success',
              title: `Paiement encaissé (${p.codePaiement || p.idPaiement})`,
              message: `Mode : ${p.modePaiement || '—'}`,
              meta: p.datePaiement ? timeAgo(new Date(p.datePaiement).toISOString()) : '',
            });
          });
        }

        if (seenBons === null || seenPaiments === null) {
          // Premier chargement : on mémorise l'état sans notifier
          saveStorage(SEEN_KEY, (bons || []).map(b => String(b.idBonCommande)));
          saveStorage(SEEN_PAIEMENTS, (paiements || []).map(p => String(p.idPaiement)));
        } else {
          if (Array.isArray(bons)) saveStorage(SEEN_KEY, bons.map(b => String(b.idBonCommande)));
          if (Array.isArray(paiements)) saveStorage(SEEN_PAIEMENTS, paiements.map(p => String(p.idPaiement)));
        }
      } catch { /* ignore */ }
    }

    scan();
    const interval = setInterval(scan, 30000);
    return () => clearInterval(interval);
  }, [loaded, notify]);

  /* ── État initial : quelques notifications contextuelles ── */
  useEffect(() => {
    let cancelled = false;

    async function seed() {
      const d = new Date();
      const todayStr = d.toISOString().slice(0, 10);
      let stats = null;
      let bons = [];
      try {
        stats = await dashboardService.stats();
        bons = await bonCommandeService.list();
      } catch { /* ignore */ }

      if (cancelled) return;

      const pendingCount = (bons || []).filter(b => b.statutBon === 'EN_COURS').length;
      const todayCount = (bons || []).filter(b => String(b.dateBon).startsWith(todayStr)).length;

      const seeded = [];
      if (pendingCount > 0) seeded.push({
        id: 'seed-pending',
        type: 'warn',
        title: `${pendingCount} commande${pendingCount > 1 ? 's' : ''} en cours de traitement`,
        message: 'Pensez à valider les paiements associés',
        meta: 'À traiter',
        read: false,
        date: new Date().toISOString(),
      });
      if (todayCount > 0) seeded.push({
        id: 'seed-today',
        type: 'info',
        title: `${todayCount} bon${todayCount > 1 ? 's' : ''} de commande enregistré${todayCount > 1 ? 's' : ''} aujourd'hui`,
        message: 'Activité commerciale détectée',
        meta: timeAgo(d.toISOString()),
        read: false,
        date: new Date().toISOString(),
      });
      if (stats && stats.totalVentes > 0) seeded.push({
        id: 'seed-sales',
        type: 'success',
        title: 'Ventes enregistrées ce mois',
        message: stats.ventesParMois?.length ? 'Activité mensuelle analysée' : '',
        meta: 'Mensuel',
        read: false,
        date: new Date().toISOString(),
      });

      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => (n.id || '').toString()));
        const fresh = seeded.filter(n => !existingIds.has(n.id));
        const next = [...fresh, ...prev];
        saveStorage(NOTIF_KEY, next);
        return next;
      });
      setLoaded(true);
    }

    if (firstRun.current) {
      firstRun.current = false;
      const stored = loadStorage(NOTIF_KEY, []);
      if (stored.length > 0) {
        setLoaded(true);
        return;
      }
      seed();
    }

    return () => { cancelled = true; };
    /* eslint-disable-next-line */
  }, []);

  const unreadCount = notifications.filter(n => !n.read && n.id !== null).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, notify, markAllRead, markRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications doit être utilisé dans NotificationProvider');
  return ctx;
}