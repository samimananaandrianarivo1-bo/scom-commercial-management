import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './components/layout/AppLayout.jsx';

import Login from './pages/auth/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Vendeurs from './pages/Vendeurs.jsx';
import VendeurDetail from './pages/VendeurDetail.jsx';
import Rayons from './pages/Rayons.jsx';
import BonsCommandes from './pages/BonsCommandes.jsx';
import BonCommandeDetail from './pages/BonCommandeDetail.jsx';
import Commissions from './pages/Commissions.jsx';
import CommissionDetail from './pages/CommissionDetail.jsx';
import Paiements from './pages/Paiements.jsx';
import Utilisateurs from './pages/Utilisateurs.jsx';
import Rapports from './pages/Rapports.jsx';
import Parametres from './pages/Parametres.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard"          element={<Dashboard />} />
        <Route path="/vendeurs"           element={<Vendeurs />} />
        <Route path="/vendeurs/:id"       element={<VendeurDetail />} />
        <Route path="/rayons"             element={<Rayons />} />
        <Route path="/bons-commandes"     element={<BonsCommandes />} />
        <Route path="/bons-commandes/:id" element={<BonCommandeDetail />} />
        <Route path="/commissions"        element={<Commissions />} />
        <Route path="/commissions/:id"    element={<CommissionDetail />} />
        <Route path="/paiements"          element={<Paiements />} />
        <Route path="/utilisateurs"       element={<Utilisateurs />} />
        <Route path="/rapports"           element={<Rapports />} />
        <Route path="/parametres"         element={<Parametres />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
