import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Building2, ClipboardList, Eye, Users, Database, Home, Menu, X, List } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/ingreso-empresa', icon: Building2, label: 'Ingreso Empresa' },
    { to: '/ingreso-visita', icon: ClipboardList, label: 'Ingreso Visita' },
    { to: '/visitas-realizadas', icon: Eye, label: 'Visitas Realizadas' },
  ];

  if (user?.isAdmin) {
    navItems.push({ to: '/admin/usuarios', icon: Users, label: 'Gestión Usuarios' });
    navItems.push({ to: '/admin/datos', icon: Database, label: 'Datos Usuarios' });
    navItems.push({ to: '/admin/visitas-totales', icon: List, label: 'Visitas Totales' });
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-lg font-bold">Sistema de Visitas</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm hidden sm:block">
              {user?.isAdmin ? '👑 Admin' : `👤 ${user?.username}`}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-800 px-3 py-1.5 rounded-md text-sm transition"
            >
              <LogOut size={16} /> Salir
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`${menuOpen ? 'block' : 'hidden'} md:block w-64 bg-white shadow-md border-r`}>
          <nav className="p-4 space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
