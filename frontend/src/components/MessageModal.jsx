import { useState, useEffect } from 'react';
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
  // Se tem 10 ou 11 dígitos, adiciona código do Brasil
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  if (digits.length >= 12) return digits; // já tem código do país
  return null;
}

export default function MessageModal({ company, searchParams, onClose }) {
  const prefs = loadPrefs();

  const [seuNome, setSeuNome] = useState(prefs.seuNome || '');
  const [seuServico, setSeuServico] = useState(prefs.seuServico || '');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const waPhone = formatWhatsApp(company.telefone);

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

      // Persist preferences
      savePrefs({ seuNome, seuServico });
    } catch (err) {
      setMessage(`Erro ao gerar mensagem: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate message on first open
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
    const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-white font-bold text-lg">✉️ Gerar Mensagem</h2>
            <p className="text-gray-400 text-sm mt-0.5">
              Mensagem personalizada para{' '}
              <span className="text-indigo-400 font-medium">{company.nome}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors ml-4 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Company info */}
          <div className="bg-gray-800/50 rounded-xl p-4 flex items-start gap-3 border border-gray-700/50">
            <span className="text-2xl">🏢</span>
            <div className="min-w-0">
              <p className="text-gray-200 font-semibold">{company.nome}</p>
              <p className="text-gray-500 text-xs mt-0.5 truncate">{company.endereco}</p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                  {company.categoria}
                </span>
                {company.telefone !== 'Não informado' && (
                  <span className="text-xs text-gray-400">📞 {company.telefone}</span>
                )}
                {company.avaliacao && (
                  <span className="text-xs text-yellow-400">★ {company.avaliacao}</span>
                )}
              </div>
            </div>
          </div>

          {/* Personalization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5">
                Seu nome
              </label>
              <input
                type="text"
                value={seuNome}
                onChange={(e) => setSeuNome(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5">
                Seu serviço / produto
              </label>
              <input
                type="text"
                value={seuServico}
                onChange={(e) => setSeuServico(e.target.value)}
                placeholder="Ex: sites e marketing digital"
                className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-600"
              />
            </div>
          </div>

          <button
            onClick={generateMessage}
            disabled={isLoading}
            className="w-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-300 text-sm font-medium py-2.5 rounded-xl border border-gray-700 transition-colors"
          >
            {isLoading ? '⏳ Gerando...' : '🔄 Regenerar Mensagem'}
          </button>

          {/* Message preview */}
          {message && (
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5">
                Mensagem gerada — edite à vontade:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={10}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleCopy}
              disabled={!message}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              {copied ? '✅ Copiado!' : '📋 Copiar Mensagem'}
            </button>

            {waPhone && (
              <button
                onClick={handleWhatsApp}
                disabled={!message}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                📲 Abrir no WhatsApp
              </button>
            )}

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 text-sm px-4 py-2.5 transition-colors ml-auto"
            >
              Fechar
            </button>
          </div>

          {!waPhone && company.telefone !== 'Não informado' && (
            <p className="text-gray-600 text-xs">
              * Formato do telefone não reconhecido para link do WhatsApp. Copie a mensagem e envie manualmente.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
