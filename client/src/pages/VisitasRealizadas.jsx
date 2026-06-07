import { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Filter, Building2 } from 'lucide-react';

export default function VisitasRealizadas() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [visits, setVisits] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);

  const months = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchVisits();
    } else {
      setVisits([]);
    }
  }, [selectedCompany, month, year]);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('/api/companies/mine');
      setCompanies(res.data);
    } catch (err) {
      console.error('Error al cargar empresas:', err);
    }
  };

  const fetchVisits = async () => {
    setLoading(true);
    try {
      let url = `/api/visits?companyId=${selectedCompany}`;
      if (month) url += `&month=${month}`;
      if (year) url += `&year=${year}`;
      const res = await axios.get(url);
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

  const clearFilters = () => {
    setMonth('');
    setYear('');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Eye className="text-purple-600" /> Visitas Realizadas
        </h2>
        <p className="text-gray-500 mt-1">Consulta el historial de visitas por empresa</p>
      </div>

      {/* Selección de empresa */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="">-- Selecciona una empresa --</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter size={14} className="inline mr-1" />Mes
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="">Todos los meses</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter size={14} className="inline mr-1" />Año
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="">Todos los años</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {(month || year) && (
          <button
            onClick={clearFilters}
            className="mt-3 text-sm text-purple-600 hover:text-purple-800 font-medium"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Resultados */}
      {selectedCompany && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Building2 size={18} />
              {companies.find(c => c.id == selectedCompany)?.nombre}
            </h3>
            <span className="text-sm text-gray-500">{visits.length} comentario(s)</span>
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-8">Cargando...</p>
          ) : visits.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No hay comentarios {month || year ? 'para el periodo seleccionado' : 'para esta empresa'}.
            </p>
          ) : (
            <div className="space-y-3">
              {visits.map((visit) => (
                <div key={visit.id} className="border-l-4 border-purple-400 bg-gray-50 rounded-r-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded">
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

      {!selectedCompany && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Eye size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400">Selecciona una empresa para ver sus visitas</p>
        </div>
      )}
    </div>
  );
}
