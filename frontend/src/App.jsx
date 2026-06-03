import { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import ResultsTable from './components/ResultsTable';
import MessageModal from './components/MessageModal';

const STORAGE_KEY = 'cacador_statuses';

function loadSavedStatuses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveStatus(id, status) {
  const current = loadSavedStatuses();
  current[id] = status;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export default function App() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [searchParams, setSearchParams] = useState({ nicho: '', cidade: '' });
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check API health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setIsDemo(d.demo))
      .catch(() => {});
  }, []);

  const handleSearch = async (nicho, cidade) => {
    setIsLoading(true);
    setError(null);
    setSearchParams({ nicho, cidade });

    try {
      const res = await fetch(
        `/api/search?query=${encodeURIComponent(nicho)}&cidade=${encodeURIComponent(cidade)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido');

      // Apply persisted statuses
      const saved = loadSavedStatuses();
      const withStatus = data.companies.map((c) => ({
        ...c,
        status: saved[c.id] || c.status,
      }));
      setCompanies(withStatus);
      setIsDemo(data.demo);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    saveStatus(id, newStatus);
  };

  const handleGenerateMessage = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ['Nome', 'Telefone', 'Site', 'Endereço', 'Avaliação', 'Avaliações', 'Categoria', 'Status'];
    const rows = companies.map((c) => [
      `"${c.nome}"`,
      `"${c.telefone}"`,
      `"${c.site || ''}"`,
      `"${c.endereco}"`,
      c.avaliacao ?? '',
      c.totalAvaliacoes ?? '',
      `"${c.categoria}"`,
      `"${c.status}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${searchParams.nicho}-${searchParams.cidade}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: companies.length,
    novos: companies.filter((c) => c.status === 'novo').length,
    em_contato: companies.filter((c) => c.status === 'em_contato').length,
    contatado: companies.filter((c) => c.status === 'contatado').length,
    descartado: companies.filter((c) => c.status === 'descartado').length,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* ── Header ── */}
      <header className="bg-gray-900/80 backdrop-blur border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <div>
              <h1 className="font-bold text-xl text-white leading-tight">Caçador de Clientes</h1>
              <p className="text-gray-500 text-xs">Prospecção inteligente via Google Maps</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isDemo && (
              <span className="bg-yellow-500/10 text-yellow-400 text-xs px-3 py-1.5 rounded-full border border-yellow-500/30 font-medium">
                ⚠️ Modo Demonstração
              </span>
            )}
            {companies.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-4 py-2 rounded-lg border border-gray-700 transition-colors"
              >
                <span>📥</span> Exportar CSV
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* ── Search Form ── */}
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {/* ── Error ── */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            ❌ {error}
          </div>
        )}

        {/* ── Stats + Table ── */}
        {companies.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total encontrado" value={stats.total} icon="🏢" color="indigo" />
              <StatCard label="Novos" value={stats.novos} icon="🆕" color="blue" />
              <StatCard label="Em Contato" value={stats.em_contato} icon="💬" color="yellow" />
              <StatCard label="Contatados" value={stats.contatado} icon="✅" color="green" />
            </div>

            <ResultsTable
              companies={companies}
              onStatusChange={handleStatusChange}
              onGenerateMessage={handleGenerateMessage}
            />
          </>
        )}

        {/* ── Empty State ── */}
        {!isLoading && companies.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-7xl mb-5">🔍</div>
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              Comece buscando empresas
            </h2>
            <p className="text-gray-600 max-w-sm">
              Digite um nicho e uma cidade acima para encontrar potenciais clientes no Google Maps.
            </p>
            {isDemo && (
              <p className="mt-4 text-yellow-500/70 text-sm">
                Modo demonstração ativo — os resultados serão dados fictícios.
              </p>
            )}
          </div>
        )}
      </main>

      {/* ── Message Modal ── */}
      {isModalOpen && selectedCompany && (
        <MessageModal
          company={selectedCompany}
          searchParams={searchParams}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  const colors = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
  };

  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="text-xs opacity-70 font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
