import { createContext, useContext, useEffect, useState } from 'react';
import { utilisateurService } from '../services/utilisateurService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('scom_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem('scom_user', JSON.stringify(user));
    else localStorage.removeItem('scom_user');
  }, [user]);

  async function login(loginName, password) {
    const res = await utilisateurService.login(loginName, password);
    setUser(res);
    return res;
  }

  function logout() { setUser(null); }

  async function updatePhoto(base64Photo) {
    if (!user) return;
    const res = await utilisateurService.updatePhoto(user.idUtilisateur, base64Photo);
    setUser(res);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updatePhoto, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
}
