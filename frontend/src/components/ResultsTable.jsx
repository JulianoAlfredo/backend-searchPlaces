import { useState } from 'react';

const STATUS_OPTIONS = [
  { value: 'novo', label: 'Novo', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { value: 'em_contato', label: 'Em Contato', bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  { value: 'contatado', label: 'Contatado', bg: 'bg-green-500/10 text-green-400 border-green-500/30' },
  { value: 'descartado', label: 'Descartado', bg: 'bg-red-500/10 text-red-400 border-red-500/30' },
];

function StatusBadge({ status }) {
  const opt = STATUS_OPTIONS.find((o) => o.value === status) || STATUS_OPTIONS[0];
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${opt.bg}`}>
      {opt.label}
    </span>
  );
}

function StarRating({ value }) {
  if (!value) return <span className="text-gray-600 text-xs">—</span>;
  return (
    <span className="flex items-center gap-1 text-sm">
      <span className="text-yellow-400">★</span>
      <span className="text-gray-300 font-medium">{value.toFixed(1)}</span>
    </span>
  );
}

export default function ResultsTable({ companies, onStatusChange, onGenerateMessage }) {
  const [filter, setFilter] = useState('todos');
  const [search, setSearch] = useState('');

  const filtered = companies.filter((c) => {
    const matchStatus = filter === 'todos' || c.status === filter;
    const matchSearch =
      !search ||
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.categoria.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Table toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm font-medium">
            {filtered.length} empresa{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            <FilterBtn label="Todos" value="todos" current={filter} onClick={setFilter} />
            {STATUS_OPTIONS.map((o) => (
              <FilterBtn key={o.value} label={o.label} value={o.value} current={filter} onClick={setFilter} />
            ))}
          </div>

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar por nome..."
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-600 w-44"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left w-8">#</th>
              <th className="px-4 py-3 text-left">Empresa</th>
              <th className="px-4 py-3 text-left">Telefone</th>
              <th className="px-4 py-3 text-left">Site</th>
              <th className="px-4 py-3 text-left">Avaliação</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-600">
                  Nenhuma empresa encontrada com esses filtros.
                </td>
              </tr>
            )}
            {filtered.map((company, i) => (
              <tr
                key={company.id}
                className="hover:bg-gray-800/40 transition-colors group"
              >
                {/* # */}
                <td className="px-4 py-3 text-gray-600">{i + 1}</td>

                {/* Empresa */}
                <td className="px-4 py-3 max-w-xs">
                  <div className="font-medium text-gray-200 truncate">{company.nome}</div>
                  <div className="text-gray-500 text-xs mt-0.5 truncate">{company.endereco}</div>
                  <span className="inline-block text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full mt-1">
                    {company.categoria}
                  </span>
                </td>

                {/* Telefone */}
                <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                  {company.telefone !== 'Não informado' ? (
                    <a
                      href={`tel:${company.telefone}`}
                      className="hover:text-indigo-400 transition-colors"
                    >
                      {company.telefone}
                    </a>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>

                {/* Site */}
                <td className="px-4 py-3">
                  {company.site ? (
                    <a
                      href={company.site}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 text-xs truncate max-w-[150px] block transition-colors"
                      title={company.site}
                    >
                      🔗 {new URL(company.site).hostname}
                    </a>
                  ) : (
                    <span className="text-gray-600 text-xs">Sem site</span>
                  )}
                </td>

                {/* Avaliação */}
                <td className="px-4 py-3">
                  <div>
                    <StarRating value={company.avaliacao} />
                    {company.totalAvaliacoes > 0 && (
                      <div className="text-gray-600 text-xs mt-0.5">
                        {company.totalAvaliacoes} avaliações
                      </div>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <select
                    value={company.status}
                    onChange={(e) => onStatusChange(company.id, e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Ações */}
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onGenerateMessage(company)}
                    className="bg-indigo-600/80 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    ✉️ Gerar Mensagem
                  </button>
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
        active
          ? 'bg-indigo-600 text-white'
          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );
}
