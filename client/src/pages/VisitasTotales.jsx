import { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ChevronDown, ChevronUp, User, Building2, Calendar } from 'lucide-react';

export default function VisitasTotales() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchAllVisits();
  }, []);

  const fetchAllVisits = async () => {
    try {
      const res = await axios.get('/api/visits');
      setVisits(res.data);
    } catch (err) {
      console.error('Error al cargar visitas:', err);
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

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <List className="text-teal-600" /> Visitas Totales
        </h2>
        <p className="text-gray-500 mt-1">Listado de todas las visitas realizadas por todos los usuarios</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {loading ? (
          <p className="text-center text-gray-400 py-8">Cargando visitas...</p>
        ) : visits.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No hay visitas registradas aún.</p>
        ) : (
          <div className="space-y-2">
            {visits.map((visit) => (
              <div key={visit.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Fila principal - clickeable */}
                <button
                  onClick={() => toggleExpand(visit.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition text-left"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded whitespace-nowrap">
                      <Calendar size={12} />
                      {formatDate(visit.createdAt)}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-gray-800 truncate">
                      <Building2 size={14} className="text-gray-400 flex-shrink-0" />
                      {visit.Company?.nombre || 'Empresa'}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap">
                      <User size={12} className="text-gray-400" />
                      {visit.User?.username || 'Usuario'}
                    </span>
                  </div>
                  {expandedId === visit.id ? (
                    <ChevronUp size={18} className="text-gray-400 flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400 flex-shrink-0 ml-2" />
                  )}
                </button>

                {/* Detalle expandido */}
                {expandedId === visit.id && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Comentario</span>
                        <p className="text-gray-700 text-sm mt-1 bg-white p-3 rounded-lg border border-gray-200">
                          {visit.comentario}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contacto</span>
                        <p className="text-gray-700 text-sm mt-1 bg-white p-3 rounded-lg border border-gray-200">
                          {visit.contacto || 'No especificado'}
                        </p>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500 pt-1">
                        <span><strong>Empresa:</strong> {visit.Company?.nombre} ({visit.Company?.rut})</span>
                        <span><strong>Usuario:</strong> {visit.User?.username}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
