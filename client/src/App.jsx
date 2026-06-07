import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import IngresoEmpresa from './pages/IngresoEmpresa';
import IngresoVisita from './pages/IngresoVisita';
import VisitasRealizadas from './pages/VisitasRealizadas';
import AdminUsers from './pages/AdminUsers';
import AdminData from './pages/AdminData';
import VisitasTotales from './pages/VisitasTotales';
import Layout from './components/Layout';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  return user.isAdmin ? children : <Navigate to="/" />;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>;

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="ingreso-empresa" element={<IngresoEmpresa />} />
        <Route path="ingreso-visita" element={<IngresoVisita />} />
        <Route path="visitas-realizadas" element={<VisitasRealizadas />} />
        <Route path="admin/usuarios" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="admin/datos" element={<AdminRoute><AdminData /></AdminRoute>} />
        <Route path="admin/visitas-totales" element={<AdminRoute><VisitasTotales /></AdminRoute>} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
