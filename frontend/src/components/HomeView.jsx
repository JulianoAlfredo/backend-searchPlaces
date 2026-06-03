import { useState, useEffect } from 'react';
import { Archive, Flame, MessagesSquare, CheckCircle2, RefreshCw, Trophy, AlertTriangle } from 'lucide-react';
import TopOpportunities from './TopOpportunities';
import { api } from '../api';
import * as store from '../store';

/**
 * Painel principal (home): métricas do funil + Top oportunidades do Brasil,
 * puxadas automaticamente uma vez por dia (cache local por data).
 */
export default function HomeView({ stats, savedIds, onDiagnose, onGenerateMessage, onSave }) {
  const [destaques, setDestaques] = useState(() => store.getCachedHighlights() || []);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const carregar = async (forcar = false) => {
    if (!forcar) {
      const cache = store.getCachedHighlights();
      if (cache && cache.length) { setDestaques(cache); return; }
    }
    setLoading(true);
    setErro(null);
    try {
      const res = await api.highlights();
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao carregar destaques');
      setDestaques(data.companies || []);
      store.setCachedHighlights(data.companies || []);
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(false); /* eslint-disable-next-line */ }, []);

  const cards = [
    { label: 'No acervo', value: stats.total, Icon: Archive, color: 'text-brand-400' },
    { label: 'Quentes salvas', value: stats.novo, Icon: Flame, color: 'text-rose-400' },
    { label: 'Em contato', value: stats.em_contato, Icon: MessagesSquare, color: 'text-amber-400' },
    { label: 'Contatadas', value: stats.contatado, Icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Painel principal</h2>
        <p className="text-slate-500 text-sm mt-1">
          Empresas de alto potencial para sistemas, puxadas do Brasil todo — e o resumo do seu funil.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <c.Icon className={`w-4 h-4 ${c.color}`} />
              <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wide">{c.label}</span>
            </div>
            <p className="text-3xl font-bold text-slate-100">{c.value}</p>
          </div>
        ))}
      </div>

      <section className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-white font-bold text-base leading-tight">Top oportunidades do dia</h3>
              <p className="text-slate-500 text-xs">Maior potencial de sistema (temperatura), de todo o Brasil</p>
            </div>
          </div>
          <button
            onClick={() => carregar(true)}
            disabled={loading}
            title="Atualizar destaques"
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Atualizar
          </button>
        </div>

        {loading && destaques.length === 0 ? (
          <div className="space-y-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 bg-slate-800/40 border border-slate-700/40 rounded-xl animate-pulse" />
            ))}
            <p className="text-slate-600 text-xs text-center pt-1">Puxando empresas de alto potencial do Brasil...</p>
          </div>
        ) : erro && destaques.length === 0 ? (
          <div className="flex items-center gap-2 text-rose-400 text-sm p-3">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {erro}
          </div>
        ) : (
          <TopOpportunities
            leads={destaques}
            savedIds={savedIds}
            onSave={onSave}
            onDiagnose={onDiagnose}
            onGenerateMessage={onGenerateMessage}
          />
        )}
      </section>
    </div>
  );
}
