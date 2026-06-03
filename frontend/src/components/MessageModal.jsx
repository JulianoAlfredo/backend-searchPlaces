import { useState, useEffect } from 'react';
import { X, Building2, Phone, Star, Send, Copy, Check, RefreshCw, MessageCircle } from 'lucide-react';
import { api } from '../api';

const PREF_KEY = 'cacador_user_prefs';

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
  } catch {
    return {};
  }
}

function savePrefs(prefs) {
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}

function formatWhatsApp(phone) {
  if (!phone || phone === 'Não informado') return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  if (digits.length >= 12) return digits;
  return null;
}

export default function MessageModal({ company, searchParams, onClose }) {
  const prefs = loadPrefs();

  const [seuNome, setSeuNome] = useState(prefs.seuNome || '');
  const [seuServico, setSeuServico] = useState(prefs.seuServico || '');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Prefere o WhatsApp extraído do site; senão tenta formatar o telefone.
  const waPhone = company.site_info?.whatsapp || formatWhatsApp(company.telefone);

  const generateMessage = async () => {
    setIsLoading(true);
    try {
      const res = await api.message({
        empresa: company,
        nicho: searchParams.nicho,
        cidade: searchParams.cidade,
        seuNome: seuNome || '[Seu Nome]',
        seuServico: seuServico || 'soluções digitais para empresas',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(data.message);
      savePrefs({ seuNome, seuServico });
    } catch (err) {
      setMessage(`Erro ao gerar mensagem: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!waPhone) return;
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-start justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-brand-500/15 text-brand-400 flex items-center justify-center">
              <Send className="w-4.5 h-4.5" />
            </span>
            <div>
              <h2 className="text-white font-bold text-lg">Gerar mensagem</h2>
              <p className="text-slate-400 text-sm mt-0.5">
                Abordagem personalizada para <span className="text-brand-400 font-medium">{company.nome}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-slate-800/50 rounded-xl p-4 flex items-start gap-3 border border-slate-700/50">
            <span className="w-9 h-9 rounded-lg bg-slate-700/60 text-slate-300 flex items-center justify-center shrink-0">
              <Building2 className="w-4.5 h-4.5" />
            </span>
            <div className="min-w-0">
              <p className="text-slate-200 font-semibold">{company.nome}</p>
              <p className="text-slate-500 text-xs mt-0.5 truncate">{company.endereco}</p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs">
                <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{company.categoria}</span>
                {company.telefone !== 'Não informado' && (
                  <span className="inline-flex items-center gap-1 text-slate-400"><Phone className="w-3 h-3" /> {company.telefone}</span>
                )}
                {company.avaliacao && (
                  <span className="inline-flex items-center gap-1 text-amber-400"><Star className="w-3 h-3 fill-amber-400" /> {company.avaliacao}</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Seu nome" value={seuNome} onChange={setSeuNome} placeholder="Ex: João Silva" />
            <Input label="Seu serviço / produto" value={seuServico} onChange={setSeuServico} placeholder="Ex: sites e sistemas web" />
          </div>

          <button
            onClick={generateMessage}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-sm font-medium py-2.5 rounded-xl border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Gerando...' : 'Regenerar mensagem'}
          </button>

          {message && (
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Mensagem gerada — edite à vontade:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={10}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none leading-relaxed"
              />
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleCopy}
              disabled={!message}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar mensagem'}
            </button>

            {waPhone && (
              <button
                onClick={handleWhatsApp}
                disabled={!message}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Abrir no WhatsApp
              </button>
            )}

            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm px-4 py-2.5 transition-colors ml-auto">
              Fechar
            </button>
          </div>

          {!waPhone && company.telefone !== 'Não informado' && (
            <p className="text-slate-600 text-xs">
              Formato do telefone não reconhecido para link do WhatsApp. Copie a mensagem e envie manualmente.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-slate-400 text-xs font-medium mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-slate-600"
      />
    </div>
  );
}
