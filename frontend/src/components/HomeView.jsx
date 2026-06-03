import { Archive, Flame, MessagesSquare, CheckCircle2, Search, BookmarkPlus } from 'lucide-react';
import TopOpportunities from './TopOpportunities';

/**
 * Painel principal (home): visão rápida do acervo + as melhores oportunidades
 * ainda sem contato, de todo o Brasil.
 */
export default function HomeView({ topLeads, stats, onDiagnose, onGenerateMessage, onGoToSearch }) {
  const cards = [
    { label: 'No acervo', value: stats.total, Icon: Archive, color: 'text-brand-400' },
    { label: 'Oportunidades novas', value: stats.novo, Icon: Flame, color: 'text-rose-400' },
    { label: 'Em contato', value: stats.em_contato, Icon: MessagesSquare, color: 'text-amber-400' },
    { label: 'Contatadas', value: stats.contatado, Icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Painel principal</h2>
        <p className="text-slate-500 text-sm mt-1">
          Acesso rápido às melhores oportunidades do seu acervo, em todo o Brasil.
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

      {stats.total === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl">
          <BookmarkPlus className="w-14 h-14 text-slate-700 mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">Seu acervo está vazio</h3>
          <p className="text-slate-600 max-w-md text-sm mb-5">
            Busque empresas e clique em <span className="text-slate-400 font-medium">Salvar</span> nas que valem a pena.
            Elas aparecem aqui como oportunidades para abordar.
          </p>
          <button
            onClick={onGoToSearch}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            <Search className="w-4 h-4" /> Buscar empresas
          </button>
        </div>
      ) : topLeads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl">
          <CheckCircle2 className="w-12 h-12 text-emerald-500/60 mb-3" />
          <h3 className="text-lg font-semibold text-slate-400 mb-1">Tudo abordado por aqui!</h3>
          <p className="text-slate-600 max-w-md text-sm">
            Todas as empresas salvas já estão em contato ou contatadas. Salve novas oportunidades na busca para reabastecer o painel.
          </p>
        </div>
      ) : (
        <TopOpportunities leads={topLeads} onDiagnose={onDiagnose} onGenerateMessage={onGenerateMessage} />
      )}
    </div>
  );
}
