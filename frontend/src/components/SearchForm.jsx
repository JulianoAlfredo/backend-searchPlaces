import { useState } from 'react';
import { Search, MapPin, Briefcase, Loader2 } from 'lucide-react';

// Nichos com maior potencial de comprar sistemas (operação complexa)
const NICHO_SUGESTOES = [
  'Distribuidora', 'Indústria', 'Transportadora', 'Atacadista', 'Construtora',
  'Logística', 'Importadora', 'Concessionária', 'Cooperativa', 'Supermercado',
  'Clínica', 'Laboratório', 'Rede de ensino', 'Contabilidade', 'Imobiliária',
];

// Atalhos de alto potencial mostrados como chips
const PRESETS = ['Distribuidora', 'Indústria', 'Transportadora', 'Construtora', 'Atacadista', 'Concessionária'];

const CIDADE_SUGESTOES = [
  'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre',
  'Brasília', 'Salvador', 'Recife', 'Fortaleza', 'Manaus', 'Goiânia',
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
      className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <Search className="w-4 h-4 text-brand-400" />
        <h2 className="text-slate-300 font-semibold text-sm uppercase tracking-widest">
          Nova busca
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Nicho / Segmento"
          icon={Briefcase}
          value={nicho}
          onChange={setNicho}
          placeholder="Ex: Contabilidade, Dentista, Academia..."
          listId="nicho-list"
          options={NICHO_SUGESTOES}
        />
        <Field
          label="Cidade"
          icon={MapPin}
          value={cidade}
          onChange={setCidade}
          placeholder="Ex: São Paulo, Goiânia..."
          listId="cidade-list"
          options={CIDADE_SUGESTOES}
        />
      </div>

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-slate-600 text-xs">Alto potencial:</span>
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setNicho(p)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              nicho === p ? 'bg-brand-600 text-white border-brand-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="submit"
          disabled={isLoading || !nicho.trim() || !cidade.trim()}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm shadow-lg shadow-brand-600/20 disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Buscando empresas...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" /> Buscar empresas
            </>
          )}
        </button>
        <p className="text-slate-500 text-xs">
          Salve as empresas que quiser acompanhar no funil.
        </p>
      </div>
    </form>
  );
}

function Field({ label, icon: Icon, value, onChange, placeholder, listId, options }) {
  return (
    <div>
      <label className="block text-slate-400 text-xs font-medium mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          list={listId}
          className="w-full bg-slate-800/70 border border-slate-700 text-slate-100 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder-slate-600 transition"
          required
        />
        <datalist id={listId}>
          {options.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>
    </div>
  );
}
