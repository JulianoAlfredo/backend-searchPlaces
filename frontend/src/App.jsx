import { useState, useEffect, useMemo } from 'react';
import { Home, Search, Users, Download, AlertTriangle, Crosshair, Building2 } from 'lucide-react';
import SearchForm from './components/SearchForm';
import ResultsTable from './components/ResultsTable';
import MessageModal from './components/MessageModal';
import DiagnoseModal from './components/DiagnoseModal';
import HomeView from './components/HomeView';
import ContactsView from './components/ContactsView';
import { api } from './api';
import * as store from './store';

export default function App() {
  const [view, setView] = useState('inicio');
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [searchParams, setSearchParams] = useState({ nicho: '', cidade: '' });
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDiagnoseOpen, setIsDiagnoseOpen] = useState(false);
  const [tick, setTick] = useState(0); // força releitura do acervo

  const refreshStore = () => setTick((t) => t + 1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const leads = useMemo(() => store.getLeads(), [tick]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const topLeads = useMemo(() => store.getTopOportunidades(12), [tick]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stats = useMemo(() => store.getStats(), [tick]);

  useEffect(() => {
    api.health().then((r) => r.json()).then((d) => setIsDemo(d.demo)).catch(() => {});
  }, []);

  const handleSearch = async (nicho, cidade) => {
    setIsLoading(true);
    setError(null);
    setSearchParams({ nicho, cidade });

    try {
      const res = await api.search(nicho, cidade);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido');

      // Busca é efêmera: apenas marca quais já estão salvas, sem gravar no acervo
      setCompanies(store.applySavedState(data.companies));
      setIsDemo(data.demo);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar uma empresa da busca no acervo (inicia o rastreamento)
  const handleSave = (company) => {
    store.saveLead(company, searchParams);
    setCompanies((prev) => prev.map((c) => (c.id === company.id ? { ...c, _saved: true, status: 'novo' } : c)));
    refreshStore();
  };

  const handleStatusChange = (id, newStatus) => {
    store.setStatus(id, newStatus);
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
    refreshStore();
  };

  const handleNotasChange = (id, notas) => { store.setNotas(id, notas); refreshStore(); };
  const handleRegistrarContato = (id) => { store.registrarContato(id); refreshStore(); };
  const handleRemove = (id) => {
    store.removeLead(id);
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, _saved: false } : c)));
    refreshStore();
  };

  const handleGenerateMessage = (company) => { setSelectedCompany(company); setIsModalOpen(true); };
  const handleDiagnose = (company) => { setSelectedCompany(company); setIsDiagnoseOpen(true); };

  const handleExportCSV = () => {
    const rows = view === 'busca' ? companies : leads;
    if (!rows.length) return;
    const headers = ['Nome', 'Telefone', 'Site', 'Endereço', 'Avaliação', 'Avaliações', 'Categoria', 'Score', 'Nível', 'Status', 'Cidade', 'Último contato', 'Notas'];
    const csv = [
      headers.join(','),
      ...rows.map((c) => [
        `"${c.nome}"`, `"${c.telefone}"`, `"${c.site || ''}"`, `"${c.endereco}"`,
        c.avaliacao ?? '', c.totalAvaliacoes ?? '', `"${c.categoria}"`,
        c.diagnostico?.score ?? '', `"${c.diagnostico?.nivel || ''}"`, `"${c.status}"`,
        `"${c.origem?.cidade || searchParams.cidade || ''}"`, `"${c.dataUltimoContato || ''}"`, `"${(c.notas || '').replace(/"/g, "'")}"`,
      ].join(',')),
    ].join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cacador-${view}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'busca', label: 'Buscar', icon: Search },
    { id: 'contatos', label: 'Contatos', icon: Users, count: stats.total },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="bg-slate-900/70 backdrop-blur border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-brand-500/15 text-brand-400 flex items-center justify-center">
              <Crosshair className="w-5 h-5" />
            </span>
            <div>
              <h1 className="font-bold text-base text-white leading-tight">Caçador de Clientes</h1>
              <p className="text-slate-500 text-xs">Prospecção inteligente via Google Maps</p>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-1 bg-slate-800/60 rounded-xl p-1">
            {tabs.map((t) => (
              <TabBtn key={t.id} label={t.label} icon={t.icon} active={view === t.id} onClick={() => setView(t.id)} count={t.count} />
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isDemo && (
              <span className="hidden md:inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 text-xs px-3 py-1.5 rounded-full border border-amber-500/30 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" /> Demonstração
              </span>
            )}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-4 py-2 rounded-lg border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4" /> <span className="hidden sm:inline">Exportar CSV</span>
            </button>
          </div>
        </div>

        <nav className="sm:hidden flex items-center gap-1 bg-slate-800/60 mx-6 mb-3 rounded-xl p-1">
          {tabs.map((t) => (
            <TabBtn key={t.id} label={t.label} icon={t.icon} active={view === t.id} onClick={() => setView(t.id)} count={t.count} full />
          ))}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {view === 'inicio' && (
          <HomeView
            topLeads={topLeads}
            stats={stats}
            onDiagnose={handleDiagnose}
            onGenerateMessage={handleGenerateMessage}
            onGoToSearch={() => setView('busca')}
          />
        )}

        {view === 'busca' && (
          <>
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            {companies.length > 0 && (
              <div>
                <p className="text-slate-500 text-xs mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {companies.length} empresas{searchParams.cidade ? ` — ${searchParams.nicho} em ${searchParams.cidade}` : ''}. Salve as que valem a pena.
                </p>
                <ResultsTable
                  companies={companies}
                  onSave={handleSave}
                  onGenerateMessage={handleGenerateMessage}
                  onDiagnose={handleDiagnose}
                />
              </div>
            )}

            {!isLoading && companies.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="w-14 h-14 text-slate-700 mb-4" />
                <h2 className="text-xl font-semibold text-slate-400 mb-2">Comece buscando empresas</h2>
                <p className="text-slate-600 max-w-sm text-sm">
                  Informe um nicho e uma cidade. Depois salve as empresas que quiser acompanhar — elas vão para o seu painel e seus contatos.
                </p>
              </div>
            )}
          </>
        )}

        {view === 'contatos' && (
          <ContactsView
            leads={leads}
            stats={stats}
            onStatusChange={handleStatusChange}
            onNotasChange={handleNotasChange}
            onRegistrarContato={handleRegistrarContato}
            onRemove={handleRemove}
            onDiagnose={handleDiagnose}
            onGenerateMessage={handleGenerateMessage}
          />
        )}
      </main>

      {isModalOpen && selectedCompany && (
        <MessageModal company={selectedCompany} searchParams={searchParams} onClose={() => setIsModalOpen(false)} />
      )}
      {isDiagnoseOpen && selectedCompany && (
        <DiagnoseModal company={selectedCompany} searchParams={searchParams} onClose={() => setIsDiagnoseOpen(false)} />
      )}
    </div>
  );
}

function TabBtn({ label, icon: Icon, active, onClick, count, full }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${full ? 'flex-1' : ''} ${
        active ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
      }`}
    >
      <Icon className="w-4 h-4" /> {label}
      {count > 0 && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-slate-700 text-slate-300'}`}>
          {count}
        </span>
      )}
    </button>
  );
}
