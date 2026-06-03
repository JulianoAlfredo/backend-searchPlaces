import { useState } from 'react';
import {
  Star, Globe, ExternalLink, Phone, Mail, AtSign, MessageCircle,
  Stethoscope, MessageSquare, Filter, ArrowUpDown, Search as SearchIcon,
} from 'lucide-react';
import { diagnoseCompany } from '../diagnose';
import { NIVEL_STYLE } from '../diagnose-ui';
import { STATUS_OPTIONS, STATUS_MAP } from '../status';

function NivelBadge({ nivel }) {
  const s = NIVEL_STYLE[nivel] || NIVEL_STYLE.Baixa;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {nivel}
    </span>
  );
}

function Stars({ value }) {
  if (!value) return <span className="text-slate-600 text-xs">—</span>;
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
      <span className="text-slate-300 font-medium">{value.toFixed(1)}</span>
    </span>
  );
}

function Canais({ info }) {
  if (!info) return null;
  const itens = [
    info.email && { Icon: Mail, title: info.email },
    info.whatsapp && { Icon: MessageCircle, title: `WhatsApp: ${info.whatsapp}` },
    info.instagram && { Icon: AtSign, title: `@${info.instagram}` },
  ].filter(Boolean);
  if (!itens.length) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1">
      {itens.map(({ Icon, title }, i) => (
        <span key={i} title={title} className="text-slate-500">
          <Icon className="w-3.5 h-3.5" />
        </span>
      ))}
    </div>
  );
}

export default function ResultsTable({ companies, onStatusChange, onGenerateMessage, onDiagnose }) {
  const [filter, setFilter] = useState('todos');
  const [search, setSearch] = useState('');
  const [semSite, setSemSite] = useState(false);
  const [sortBy, setSortBy] = useState('oportunidade');

  const withDiag = companies.map((c) => ({ ...c, _diag: c.diagnostico || diagnoseCompany(c) }));

  const filtered = withDiag
    .filter((c) => {
      const matchStatus = filter === 'todos' || c.status === filter;
      const matchSearch =
        !search ||
        c.nome.toLowerCase().includes(search.toLowerCase()) ||
        c.categoria.toLowerCase().includes(search.toLowerCase());
      const matchSemSite = !semSite || !c.site;
      return matchStatus && matchSearch && matchSemSite;
    })
    .sort((a, b) => {
      if (sortBy === 'oportunidade') return b._diag.score - a._diag.score;
      if (sortBy === 'avaliacao') return (b.avaliacao || 0) - (a.avaliacao || 0);
      if (sortBy === 'reviews') return (b.totalAvaliacoes || 0) - (a.totalAvaliacoes || 0);
      return 0;
    });

  const countSemSite = companies.filter((c) => !c.site).length;
  const countAlta = withDiag.filter((c) => c._diag.nivel === 'Alta').length;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          {countAlta > 0 && (
            <button
              onClick={() => { setFilter('todos'); setSemSite(false); setSortBy('oportunidade'); }}
              className="inline-flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-rose-500/30 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              {countAlta} oportunidade{countAlta !== 1 ? 's' : ''} alta{countAlta !== 1 ? 's' : ''}
            </button>
          )}
          {countSemSite > 0 && (
            <button
              onClick={() => setSemSite((v) => !v)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                semSite
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Sem site ({countSemSite})
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
            >
              <option value="oportunidade">Por oportunidade</option>
              <option value="avaliacao">Por avaliação</option>
              <option value="reviews">Por reviews</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
            <FilterBtn label="Todos" value="todos" current={filter} onClick={setFilter} />
            {STATUS_OPTIONS.map((o) => (
              <FilterBtn key={o.value} label={o.label} value={o.value} current={filter} onClick={setFilter} />
            ))}
          </div>

          <div className="relative">
            <SearchIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar por nome..."
              className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder-slate-600 w-44"
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-2 border-b border-slate-800/60 text-slate-500 text-xs flex items-center gap-1.5">
        <Filter className="w-3 h-3" />
        {filtered.length} empresa{filtered.length !== 1 ? 's' : ''} exibida{filtered.length !== 1 ? 's' : ''}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left w-8">#</th>
              <th className="px-4 py-3 text-left">Empresa</th>
              <th className="px-4 py-3 text-left">Contato</th>
              <th className="px-4 py-3 text-left">Site</th>
              <th className="px-4 py-3 text-left">Avaliação</th>
              <th className="px-4 py-3 text-left">Oportunidade</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-600">
                  Nenhuma empresa encontrada com esses filtros.
                </td>
              </tr>
            )}
            {filtered.map((company, i) => (
              <tr key={company.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3 text-slate-600">{i + 1}</td>

                <td className="px-4 py-3 max-w-xs">
                  <div className="font-medium text-slate-200 truncate">{company.nome}</div>
                  <div className="text-slate-500 text-xs mt-0.5 truncate">{company.endereco}</div>
                  <span className="inline-block text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full mt-1">
                    {company.categoria}
                  </span>
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {company.telefone && company.telefone !== 'Não informado' ? (
                    <a href={`tel:${company.telefone}`} className="inline-flex items-center gap-1.5 text-slate-300 hover:text-brand-400 transition-colors">
                      <Phone className="w-3.5 h-3.5" /> {company.telefone}
                    </a>
                  ) : (
                    <span className="text-slate-600 text-xs">—</span>
                  )}
                  <Canais info={company.site_info} />
                </td>

                <td className="px-4 py-3">
                  {company.site ? (
                    <a
                      href={company.site}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 text-xs truncate max-w-[150px] transition-colors"
                      title={company.site}
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      {safeHost(company.site)}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-medium">
                      <Globe className="w-3 h-3" /> Sem site
                    </span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <Stars value={company.avaliacao} />
                  {company.totalAvaliacoes > 0 && (
                    <div className="text-slate-600 text-xs mt-0.5">{company.totalAvaliacoes} av.</div>
                  )}
                </td>

                <td className="px-4 py-3">
                  <NivelBadge nivel={company._diag.nivel} />
                  <div className="text-slate-600 text-xs mt-1">
                    {company._diag.pontos.filter((p) => p.tipo !== 'ok').length} pontos fracos
                  </div>
                </td>

                <td className="px-4 py-3">
                  <StatusSelect value={company.status} onChange={(v) => onStatusChange(company.id, v)} />
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onDiagnose(company)}
                      className="inline-flex items-center gap-1.5 bg-violet-600/80 hover:bg-violet-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                    >
                      <Stethoscope className="w-3.5 h-3.5" /> Diagnóstico
                    </button>
                    <button
                      onClick={() => onGenerateMessage(company)}
                      className="inline-flex items-center gap-1.5 bg-brand-600/80 hover:bg-brand-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Mensagem
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StatusSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function FilterBtn({ label, value, current, onClick }) {
  const active = current === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={`text-xs px-3 py-1.5 rounded-md transition-colors font-medium ${
        active ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
      }`}
    >
      {label}
    </button>
  );
}

function safeHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
