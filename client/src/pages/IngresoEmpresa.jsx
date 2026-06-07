import { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, Trash2, Plus } from 'lucide-react';

export default function IngresoEmpresa() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ nombre: '', rut: '', tamanoEmpresa: '', comuna: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('/api/companies/mine');
      setCompanies(res.data);
    } catch (err) {
      console.error('Error al cargar empresas:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await axios.post('/api/companies', form);
      setMessage('Empresa guardada correctamente.');
      setForm({ nombre: '', rut: '', tamanoEmpresa: '', comuna: '' });
      fetchCompanies();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la empresa.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta empresa? Se eliminarán también sus visitas.')) return;
    try {
      await axios.delete(`/api/companies/${id}`);
      setMessage('Empresa eliminada correctamente.');
      fetchCompanies();
    } catch (err) {
      setError('Error al eliminar la empresa.');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Building2 className="text-indigo-600" /> Ingreso Empresa
        </h2>
        <p className="text-gray-500 mt-1">Registra las instituciones que visitas</p>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Nombre de la empresa"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
            <input
              type="text"
              value={form.rut}
              onChange={(e) => setForm({ ...form, rut: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Ej: 12.345.678-9"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño Empresa</label>
            <select
              value={form.tamanoEmpresa}
              onChange={(e) => setForm({ ...form, tamanoEmpresa: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              required
            >
              <option value="">Seleccionar...</option>
              <option value="Microempresa">Microempresa (1-9 trabajadores)</option>
              <option value="Pequeña">Pequeña (10-49 trabajadores)</option>
              <option value="Mediana">Mediana (50-199 trabajadores)</option>
              <option value="Grande">Grande (200+ trabajadores)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comuna</label>
            <input
              type="text"
              value={form.comuna}
              onChange={(e) => setForm({ ...form, comuna: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Comuna de la empresa"
              required
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition disabled:opacity-50"
            >
              <Plus size={18} /> {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de empresas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Empresas Registradas</h3>
        {companies.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No hay empresas registradas aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Nombre</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">RUT</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Tamaño</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Comuna</th>
                  <th className="text-center py-3 px-2 font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-800">{company.nombre}</td>
                    <td className="py-3 px-2 text-gray-600">{company.rut}</td>
                    <td className="py-3 px-2 text-gray-600">{company.tamanoEmpresa}</td>
                    <td className="py-3 px-2 text-gray-600">{company.comuna}</td>
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => handleDelete(company.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-md transition"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
