import { useState, useCallback } from 'react';
import Sidebar from './Sidebar.jsx';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen(v => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <div className="main">
        <Outlet context={{ onToggleSidebar: toggleSidebar }} />
      </div>
    </div>
  );
}
