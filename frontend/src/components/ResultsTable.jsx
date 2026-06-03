import { useState } from 'react';
import { diagnoseCompany } from '../diagnose';

const STATUS_OPTIONS = [
  { value: 'novo', label: 'Novo', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { value: 'em_contato', label: 'Em Contato', bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  { value: 'contatado', label: 'Contatado', bg: 'bg-green-500/10 text-green-400 border-green-500/30' },
  { value: 'descartado', label: 'Descartado', bg: 'bg-red-500/10 text-red-400 border-red-500/30' },
];

const OPORTUNIDADE_STYLE = {
  Alta:  { bg: 'bg-red-500/10 text-red-400 border-red-500/30',    dot: 'bg-red-400',    label: 'Alta' },
  Media: { bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400', label: 'Media' },
  Baixa: { bg: 'bg-green-500/10 text-green-400 border-green-500/30',  dot: 'bg-green-400',  label: 'Baixa' },
};

function OportunidadeBadge({ nivel }) {
  const s = OPORTUNIDADE_STYLE[nivel] || OPORTUNIDADE_STYLE['Baixa'];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {nivel}
    </span>
  );
}

function StarRating({ value }) {
  if (!value) return <span className="text-gray-600 text-xs">--</span>;
  return (
    <span className="flex items-center gap-1 text-sm">
      <span className="text-yellow-400">*</span>
      <span className="text-gray-300 font-medium">{value.toFixed(1)}</span>
    </span>
  );
}

export default function ResultsTable({ companies, onStatusChange, onGenerateMessage, onDiagnose }) {
  const [filter, setFilter] = useState('todos');
  const [search, setSearch] = useState('');
  const [semSite, setSemSite] = useState(false);
  const [sortBy, setSortBy] = useState('oportunidade');

  const withDiag = companies.map((c) => ({ ...c, _diag: diagnoseCompany(c) }));

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
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-gray-800">
        <div className="flex items-center gap-3 flex-wrap">
          {countAlta > 0 && (
            <button
              onClick={() => { setFilter('todos'); setSemSite(false); setSortBy('oportunidade'); }}
              className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-500/30 transition-colors"
            >
              {countAlta} oportunidade{countAlta !== 1 ? 's' : ''} Alta
            </button>
          )}
          {countSemSite > 0 && (
            <button
              onClick={() => setSemSite((v) => !v)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                semSite
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
              }`}
            >
              {semSite ? `Sem site (${countSemSite})` : `Filtrar sem site (${countSemSite})`}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-400 text-xs rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="oportunidade">Por Oportunidade</option>
            <option value="avaliacao">Por Avaliacao</option>
            <option value="reviews">Por Reviews</option>
          </select>

          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            <FilterBtn label="Todos" value="todos" current={filter} onClick={setFilter} />
            {STATUS_OPTIONS.map((o) => (
              <FilterBtn key={o.value} label={o.label} value={o.value} current={filter} onClick={setFilter} />
            ))}
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar por nome..."
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-600 w-44"
          />
        </div>
      </div>

      <div className="px-4 py-2 border-b border-gray-800/60 text-gray-600 text-xs">
        {filtered.length} empresa{filtered.length !== 1 ? 's' : ''} exibida{filtered.length !== 1 ? 's' : ''}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left w-8">#</th>
              <th className="px-4 py-3 text-left">Empresa</th>
              <th className="px-4 py-3 text-left">Telefone</th>
              <th className="px-4 py-3 text-left">Site</th>
              <th className="px-4 py-3 text-left">Avaliacao</th>
              <th className="px-4 py-3 text-left">Oportunidade</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-600">
                  Nenhuma empresa encontrada com esses filtros.
                </td>
              </tr>
            )}
            {filtered.map((company, i) => (
              <tr key={company.id} className="hover:bg-gray-800/40 transition-colors">
                <td className="px-4 py-3 text-gray-600">{i + 1}</td>

                <td className="px-4 py-3 max-w-xs">
                  <div className="font-medium text-gray-200 truncate">{company.nome}</div>
                  <div className="text-gray-500 text-xs mt-0.5 truncate">{company.endereco}</div>
                  <span className="inline-block text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full mt-1">
                    {company.categoria}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                  {company.telefone && company.telefone !== 'Nao informado' ? (
                    <a href={`tel:${company.telefone}`} className="hover:text-indigo-400 transition-colors">
                      {company.telefone}
                    </a>
                  ) : (
                    <span className="text-gray-600 text-xs">--</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  {company.site ? (
                    <a
                      href={company.site}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 text-xs truncate max-w-[150px] block transition-colors"
                      title={company.site}
                    >
                      {new URL(company.site).hostname}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-medium">
                      Sem site
                    </span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <StarRating value={company.avaliacao} />
                  {company.totalAvaliacoes > 0 && (
                    <div className="text-gray-600 text-xs mt-0.5">
                      {company.totalAvaliacoes} av.
                    </div>
                  )}
                </td>

                <td className="px-4 py-3">
                  <OportunidadeBadge nivel={company._diag.nivel} />
                  <div className="text-gray-600 text-xs mt-1">
                    {company._diag.pontos.filter(p => p.tipo !== 'ok').length} pontos fracos
                  </div>
                </td>

                <td className="px-4 py-3">
                  <select
                    value={company.status}
                    onChange={(e) => onStatusChange(company.id, e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onDiagnose(company)}
                      className="bg-purple-600/80 hover:bg-purple-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Diagnostico
                    </button>
                    <button
                      onClick={() => onGenerateMessage(company)}
                      className="bg-indigo-600/80 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Mensagem
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

function FilterBtn({ label, value, current, onClick }) {
  const active = current === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={`text-xs px-3 py-1.5 rounded-md transition-colors font-medium ${
        active ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );
}
