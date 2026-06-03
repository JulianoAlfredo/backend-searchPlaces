import { Trophy, MapPin, Stethoscope, MessageSquare, Globe } from 'lucide-react';
import { NIVEL_STYLE, scoreColor } from '../diagnose-ui';

/**
 * Top oportunidades do acervo acumulado (maior score, qualquer cidade).
 */
export default function TopOpportunities({ leads, onDiagnose, onGenerateMessage }) {
  if (!leads.length) return null;

  return (
    <section className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-white font-bold text-base leading-tight">Top oportunidades</h2>
            <p className="text-slate-500 text-xs">As melhores do seu acervo, de qualquer cidade</p>
          </div>
        </div>
        <span className="text-slate-500 text-xs bg-slate-800 px-2.5 py-1 rounded-full">{leads.length}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
        {leads.map((lead, i) => {
          const diag = lead.diagnostico || {};
          const nivel = NIVEL_STYLE[diag.nivel] || NIVEL_STYLE.Baixa;
          const fraquezas = (diag.pontos || []).filter((p) => p.tipo !== 'ok').slice(0, 2).map((p) => p.titulo);
          return (
            <div key={lead.id} className="flex items-center gap-3 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 rounded-xl p-3 transition-colors">
              <span className="w-6 text-center text-sm font-bold text-slate-600 shrink-0">{i + 1}</span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-200 text-sm truncate">{lead.nome}</p>
                  <span className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${nivel.badge}`}>
                    <span className={`w-1 h-1 rounded-full ${nivel.dot}`} /> {diag.nivel}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 min-w-0">
                  {lead.origem?.cidade && (
                    <span className="inline-flex items-center gap-1 shrink-0"><MapPin className="w-3 h-3" /> {lead.origem.cidade}</span>
                  )}
                  {!lead.site && (
                    <span className="inline-flex items-center gap-1 text-orange-400/80 shrink-0"><Globe className="w-3 h-3" /> sem site</span>
                  )}
                  <span className="truncate">{fraquezas.join(' · ')}</span>
                </div>
              </div>

              <span className={`shrink-0 text-lg font-bold ${scoreColor(diag.score || 0)}`}>{diag.score ?? '—'}</span>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onDiagnose(lead)}
                  title="Diagnóstico"
                  className="p-1.5 rounded-lg bg-violet-600/70 hover:bg-violet-500 text-white transition-colors"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onGenerateMessage(lead)}
                  title="Mensagem"
                  className="p-1.5 rounded-lg bg-brand-600/70 hover:bg-brand-500 text-white transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
