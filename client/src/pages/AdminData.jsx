import { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, Building2, Eye } from 'lucide-react';

export default function AdminData() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchCompanies();
    } else {
      setCompanies([]);
      setVisits([]);
    }
    setSelectedCompany('');
  }, [selectedUser]);

  useEffect(() => {
    if (selectedCompany) {
      fetchVisits();
    } else {
      setVisits([]);
    }
  }, [selectedCompany]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data.filter(u => !u.isAdmin));
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/companies');
      const filtered = res.data.filter(c => c.userId == selectedUser);
      setCompanies(filtered);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/visits?companyId=${selectedCompany}`);
      setVisits(res.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Database className="text-orange-600" /> Datos de Usuarios
        </h2>
        <p className="text-gray-500 mt-1">Revisa la información ingresada por cada usuario</p>
      </div>

      {/* Selección de usuario */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Usuario</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            >
              <option value="">-- Selecciona un usuario --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
              ))}
            </select>
          </div>

          {selectedUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Empresa</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="">-- Selecciona una empresa --</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre} - {c.rut}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Empresas del usuario */}
      {selectedUser && companies.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Building2 size={18} /> Empresas del usuario
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {companies.map((c) => (
              <div key={c.id} className="border border-gray-200 rounded-lg p-3">
                <p className="font-medium text-gray-800">{c.nombre}</p>
                <p className="text-xs text-gray-500">RUT: {c.rut}</p>
                <p className="text-xs text-gray-500">Tamaño: {c.tamanoEmpresa}</p>
                <p className="text-xs text-gray-500">Comuna: {c.comuna}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visitas de la empresa */}
      {selectedCompany && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Eye size={18} /> Comentarios de la empresa
          </h3>
          {loading ? (
            <p className="text-center text-gray-400 py-6">Cargando...</p>
          ) : visits.length === 0 ? (
            <p className="text-gray-400 text-center py-6">No hay comentarios registrados.</p>
          ) : (
            <div className="space-y-3">
              {visits.map((visit) => (
                <div key={visit.id} className="border-l-4 border-orange-400 bg-gray-50 rounded-r-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded">
                      {formatDate(visit.createdAt)}
                    </span>
                    {visit.contacto && (
                      <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">
                        Contacto: {visit.contacto}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mt-2">{visit.comentario}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
