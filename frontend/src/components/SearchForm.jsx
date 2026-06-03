import { useState } from 'react';

const NICHO_SUGESTOES = [
  'Contabilidade',
  'Advocacia',
  'Dentista',
  'Academia',
  'Salão de beleza',
  'Restaurante',
  'Clínica médica',
  'Imobiliária',
  'Pet shop',
  'Escola',
  'Engenharia civil',
  'Arquitetura',
  'Psicologia',
  'Fisioterapia',
  'Marketing digital',
];

const CIDADE_SUGESTOES = [
  'São Paulo',
  'Rio de Janeiro',
  'Belo Horizonte',
  'Curitiba',
  'Porto Alegre',
  'Brasília',
  'Salvador',
  'Recife',
  'Fortaleza',
  'Manaus',
];

export default function SearchForm({ onSearch, isLoading }) {
  const [nicho, setNicho] = useState('');
  const [cidade, setCidade] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nicho.trim() && cidade.trim()) {
      onSearch(nicho.trim(), cidade.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
    >
      <h2 className="text-gray-300 font-semibold text-sm uppercase tracking-widest mb-5">
        🔎 Nova busca
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nicho */}
        <div>
          <label className="block text-gray-400 text-xs font-medium mb-1.5">
            Nicho / Segmento
          </label>
          <input
            type="text"
            value={nicho}
            onChange={(e) => setNicho(e.target.value)}
            placeholder="Ex: Contabilidade, Dentista, Academia..."
            list="nicho-list"
            className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-600 transition"
            required
          />
          <datalist id="nicho-list">
            {NICHO_SUGESTOES.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        {/* Cidade */}
        <div>
          <label className="block text-gray-400 text-xs font-medium mb-1.5">
            Cidade
          </label>
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Ex: São Paulo, Rio de Janeiro..."
            list="cidade-list"
            className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-600 transition"
            required
          />
          <datalist id="cidade-list">
            {CIDADE_SUGESTOES.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={isLoading || !nicho.trim() || !cidade.trim()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 text-sm"
        >
          {isLoading ? (
            <>
              <Spinner /> Buscando empresas...
            </>
          ) : (
            <>🚀 Buscar Empresas</>
          )}
        </button>
        <p className="text-gray-600 text-xs">
          Retorna até 20 resultados do Google Maps
        </p>
      </div>
    </form>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
