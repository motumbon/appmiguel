import { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, Send } from 'lucide-react';

export default function IngresoVisita() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [comentario, setComentario] = useState('');
  const [contacto, setContacto] = useState('');
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchVisits();
    } else {
      setVisits([]);
    }
  }, [selectedCompany]);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('/api/companies/mine');
      setCompanies(res.data);
    } catch (err) {
      console.error('Error al cargar empresas:', err);
    }
  };

  const fetchVisits = async () => {
    try {
      const res = await axios.get(`/api/visits?companyId=${selectedCompany}`);
      setVisits(res.data);
    } catch (err) {
      console.error('Error al cargar visitas:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await axios.post('/api/visits', {
        companyId: selectedCompany,
        comentario,
        contacto
      });
      setMessage('Comentario registrado correctamente.');
      setComentario('');
      setContacto('');
      fetchVisits();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el comentario.');
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
          <ClipboardList className="text-green-600" /> Ingreso Visita
        </h2>
        <p className="text-gray-500 mt-1">Selecciona una empresa y registra tu visita</p>
      </div>

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

        {/* Selección de empresa */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Empresa</label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          >
            <option value="">-- Selecciona una empresa --</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre} - {c.rut}</option>
            ))}
          </select>
        </div>

        {/* Formulario de comentario (solo visible si se seleccionó empresa) */}
        {selectedCompany && (
          <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                rows={4}
                placeholder="Escribe tu comentario sobre la visita..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
              <input
                type="text"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Nombre o datos del contacto"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg transition disabled:opacity-50"
            >
              <Send size={18} /> {loading ? 'Guardando...' : 'Registrar Visita'}
            </button>
          </form>
        )}
      </div>

      {/* Lista de comentarios de la empresa seleccionada */}
      {selectedCompany && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Comentarios Registrados</h3>
          {visits.length === 0 ? (
            <p className="text-gray-400 text-center py-6">No hay comentarios para esta empresa.</p>
          ) : (
            <div className="space-y-3">
              {visits.map((visit) => (
                <div key={visit.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      {formatDate(visit.createdAt)}
                    </span>
                    {visit.contacto && (
                      <span className="text-xs text-gray-500">Contacto: {visit.contacto}</span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm">{visit.comentario}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
