import { useState } from 'react';
import {
  Search as SearchIcon, MapPin, CalendarCheck, Stethoscope, MessageSquare,
  Trash2, GripVertical,
} from 'lucide-react';
import { NIVEL_STYLE } from '../diagnose-ui';
import { STATUS_OPTIONS } from '../status';

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  } catch {
    return null;
  }
}

/**
 * Funil de prospecção em formato Kanban: uma coluna por status, com cards
 * arrastáveis (drag-and-drop nativo) para mover o cliente entre etapas.
 */
export default function KanbanView({
  leads, onStatusChange, onNotasChange, onRegistrarContato, onRemove, onDiagnose, onGenerateMessage, onOpenDetail,
}) {
  const [search, setSearch] = useState('');
  const [dragId, setDragId] = useState(null);
  const [overCol, setOverCol] = useState(null);

  const visiveis = leads.filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      l.nome.toLowerCase().includes(q) ||
      (l.origem?.cidade || '').toLowerCase().includes(q) ||
      (l.categoria || '').toLowerCase().includes(q)
    );
  });

  const porStatus = (status) =>
    visiveis
      .filter((l) => l.status === status)
      .sort((a, b) => (b.diagnostico?.score || 0) - (a.diagnostico?.score || 0));

  const handleDrop = (status) => {
    if (dragId) onStatusChange(dragId, status);
    setDragId(null);
    setOverCol(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-slate-500 text-sm">Arraste os cards entre as colunas para atualizar o status.</p>
        <div className="relative">
          <SearchIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, cidade..."
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder-slate-600 w-56"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATUS_OPTIONS.map((col) => {
          const cards = porStatus(col.value);
          const isOver = overCol === col.value;
          return (
            <div
              key={col.value}
              onDragOver={(e) => { e.preventDefault(); setOverCol(col.value); }}
              onDragLeave={() => setOverCol((c) => (c === col.value ? null : c))}
              onDrop={() => handleDrop(col.value)}
              className={`rounded-2xl border p-3 min-h-[160px] transition-colors ${
                isOver ? 'border-brand-500/60 bg-brand-500/5' : 'border-slate-800 bg-slate-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <h3 className="text-slate-300 font-semibold text-sm">{col.label}</h3>
                </div>
                <span className="text-slate-500 text-xs bg-slate-800 px-2 py-0.5 rounded-full">{cards.length}</span>
              </div>

              <div className="space-y-2.5">
                {cards.length === 0 && (
                  <p className="text-slate-600 text-xs text-center py-6">Sem empresas aqui.</p>
                )}
                {cards.map((lead) => (
                  <KanbanCard
                    key={lead.id}
                    lead={lead}
                    dragging={dragId === lead.id}
                    onDragStart={() => setDragId(lead.id)}
                    onDragEnd={() => { setDragId(null); setOverCol(null); }}
                    onNotasChange={onNotasChange}
                    onRegistrarContato={onRegistrarContato}
                    onRemove={onRemove}
                    onDiagnose={onDiagnose}
                    onGenerateMessage={onGenerateMessage}
                    onStatusChange={onStatusChange}
                    onOpenDetail={onOpenDetail}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KanbanCard({
  lead, dragging, onDragStart, onDragEnd, onNotasChange, onRegistrarContato,
  onRemove, onDiagnose, onGenerateMessage, onStatusChange, onOpenDetail,
}) {
  const nivel = NIVEL_STYLE[lead.diagnostico?.nivel] || NIVEL_STYLE.Frio;
  const data = formatDate(lead.dataUltimoContato);
  const stop = (e) => e.stopPropagation();

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onOpenDetail?.(lead)}
      className={`bg-slate-800/70 border border-slate-700/60 rounded-xl p-3 cursor-pointer transition-opacity ${
        dragging ? 'opacity-40' : 'hover:border-slate-600'
      }`}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-slate-200 text-sm truncate">{lead.nome}</p>
            <span className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${nivel.badge}`}>
              {lead.diagnostico?.score ?? '—'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 min-w-0">
            {lead.origem?.cidade && (
              <span className="inline-flex items-center gap-1 shrink-0"><MapPin className="w-3 h-3" /> {lead.origem.cidade}</span>
            )}
            <span className="truncate">{lead.categoria}</span>
          </div>
        </div>
      </div>

      <input
        type="text"
        defaultValue={lead.notas}
        onClick={stop}
        onBlur={(e) => { if (e.target.value !== lead.notas) onNotasChange(lead.id, e.target.value); }}
        placeholder="Adicionar nota..."
        className="w-full mt-2.5 bg-slate-900/60 border border-slate-700/60 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder-slate-600"
      />

      <div className="flex items-center justify-between mt-2.5" onClick={stop}>
        <button
          onClick={() => onRegistrarContato(lead.id)}
          title="Registrar contato agora"
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <CalendarCheck className="w-3.5 h-3.5" /> {data || 'contato'}
        </button>

        <div className="flex items-center gap-1">
          <button onClick={() => onDiagnose(lead)} title="Diagnóstico" className="p-1.5 rounded-lg bg-violet-600/70 hover:bg-violet-500 text-white transition-colors">
            <Stethoscope className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onGenerateMessage(lead)} title="Mensagem" className="p-1.5 rounded-lg bg-brand-600/70 hover:bg-brand-500 text-white transition-colors">
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onRemove(lead.id)} title="Remover" className="p-1.5 rounded-lg bg-slate-700/70 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Fallback de status (mobile/sem arrastar) */}
      <select
        value={lead.status}
        onClick={stop}
        onChange={(e) => onStatusChange(lead.id, e.target.value)}
        className="md:hidden w-full mt-2 bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
