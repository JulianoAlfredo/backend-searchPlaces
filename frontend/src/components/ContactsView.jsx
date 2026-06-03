import { useState } from 'react';
import {
  Users, Search as SearchIcon, Stethoscope, MessageSquare, Trash2,
  CalendarCheck, MapPin, Inbox,
} from 'lucide-react';
import { NIVEL_STYLE } from '../diagnose-ui';
import { STATUS_OPTIONS, STATUS_MAP } from '../status';
import { StatusSelect } from './ResultsTable';

function formatDate(iso) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return null;
  }
}

export default function ContactsView({
  leads, stats, onStatusChange, onNotasChange, onRegistrarContato, onRemove, onDiagnose, onGenerateMessage,
}) {
  const [filter, setFilter] = useState('todos');
  const [search, setSearch] = useState('');

  const filtered = leads
    .filter((l) => {
      const matchStatus = filter === 'todos' || l.status === filter;
      const matchSearch =
        !search ||
        l.nome.toLowerCase().includes(search.toLowerCase()) ||
        (l.origem?.cidade || '').toLowerCase().includes(search.toLowerCase()) ||
        (l.categoria || '').toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    })
    .sort((a, b) => (b.diagnostico?.score || 0) - (a.diagnostico?.score || 0));

  if (!leads.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Inbox className="w-14 h-14 text-slate-700 mb-4" />
        <h2 className="text-xl font-semibold text-slate-400 mb-2">Seu acervo está vazio</h2>
        <p className="text-slate-600 max-w-sm text-sm">
          Faça buscas na aba <span className="text-slate-400">Buscar</span> — cada empresa encontrada entra automaticamente aqui para você acompanhar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatChip label="Total" value={stats.total} active={filter === 'todos'} onClick={() => setFilter('todos')} />
        {STATUS_OPTIONS.map((o) => (
          <StatChip
            key={o.value}
            label={o.label}
            value={stats[o.value] || 0}
            icon={o.icon}
            dot={o.dot}
            active={filter === o.value}
            onClick={() => setFilter(o.value)}
          />
        ))}
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-400" />
            <h2 className="text-slate-300 font-semibold text-sm">Acervo de contatos</h2>
          </div>
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

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Empresa</th>
                <th className="px-4 py-3 text-left">Origem</th>
                <th className="px-4 py-3 text-left">Oport.</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Último contato</th>
                <th className="px-4 py-3 text-left">Anotações</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-600">Nenhum contato com esses filtros.</td>
                </tr>
              )}
              {filtered.map((lead) => {
                const nivel = NIVEL_STYLE[lead.diagnostico?.nivel] || NIVEL_STYLE.Baixa;
                const data = formatDate(lead.dataUltimoContato);
                return (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors align-top">
                    <td className="px-4 py-3 max-w-[220px]">
                      <div className="font-medium text-slate-200 truncate">{lead.nome}</div>
                      <span className="inline-block text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full mt-1">{lead.categoria}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                      {lead.origem?.cidade ? (
                        <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {lead.origem.cidade}</span>
                      ) : '—'}
                      {lead.origem?.nicho && <div className="text-slate-600 mt-0.5">{lead.origem.nicho}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${nivel.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${nivel.dot}`} /> {lead.diagnostico?.score ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect value={lead.status} onChange={(v) => onStatusChange(lead.id, v)} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => onRegistrarContato(lead.id)}
                        title="Registrar contato agora"
                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                      >
                        <CalendarCheck className="w-3.5 h-3.5" />
                        {data || 'registrar'}
                      </button>
                    </td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <input
                        type="text"
                        defaultValue={lead.notas}
                        onBlur={(e) => { if (e.target.value !== lead.notas) onNotasChange(lead.id, e.target.value); }}
                        placeholder="Adicionar nota..."
                        className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder-slate-600"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => onDiagnose(lead)} title="Diagnóstico" className="p-1.5 rounded-lg bg-violet-600/70 hover:bg-violet-500 text-white transition-colors">
                          <Stethoscope className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onGenerateMessage(lead)} title="Mensagem" className="p-1.5 rounded-lg bg-brand-600/70 hover:bg-brand-500 text-white transition-colors">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onRemove(lead.id)} title="Remover do acervo" className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatChip({ label, value, icon: Icon, dot, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-3 text-left transition-colors ${
        active ? 'bg-brand-500/10 border-brand-500/40' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center gap-1.5 mb-1">
        {dot ? <span className={`w-1.5 h-1.5 rounded-full ${dot}`} /> : Icon ? <Icon className="w-3.5 h-3.5 text-slate-500" /> : null}
        <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wide truncate">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-100">{value}</p>
    </button>
  );
}
