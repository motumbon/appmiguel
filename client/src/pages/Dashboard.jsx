import { useAuth } from '../context/AuthContext';
import { Building2, ClipboardList, Eye, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  const cards = [
    {
      title: 'Ingreso Empresa',
      description: 'Registra nuevas empresas/instituciones para hacer seguimiento.',
      icon: Building2,
      to: '/ingreso-empresa',
      color: 'bg-blue-500'
    },
    {
      title: 'Ingreso Visita',
      description: 'Registra visitas y comentarios sobre las empresas.',
      icon: ClipboardList,
      to: '/ingreso-visita',
      color: 'bg-green-500'
    },
    {
      title: 'Visitas Realizadas',
      description: 'Consulta el historial de visitas y comentarios.',
      icon: Eye,
      to: '/visitas-realizadas',
      color: 'bg-purple-500'
    },
  ];

  if (user?.isAdmin) {
    cards.push({
      title: 'Gestión de Usuarios',
      description: 'Administra los usuarios de la plataforma.',
      icon: Users,
      to: '/admin/usuarios',
      color: 'bg-red-500'
    });
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Bienvenido, {user?.isAdmin ? 'Administrador' : user?.username}
        </h2>
        <p className="text-gray-500 mt-1">Selecciona una opción para comenzar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(({ title, description, icon: Icon, to, color }) => (
          <Link
            key={to}
            to={to}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition group"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 ${color} rounded-lg mb-4`}>
              <Icon size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">
              {title}
            </h3>
            <p className="text-gray-500 text-sm mt-2">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
