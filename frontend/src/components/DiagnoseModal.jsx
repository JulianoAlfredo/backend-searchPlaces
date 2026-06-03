import { useState, useEffect } from 'react';
import { diagnoseCompany } from '../diagnose';
import { api } from '../api';

const TIPO_STYLE = {
  critico: { bg: 'bg-red-500/10 border-red-500/20 text-red-300', icon: '🔴' },
  alerta:  { bg: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300', icon: '🟡' },
  ok:      { bg: 'bg-green-500/10 border-green-500/20 text-green-300', icon: '✅' },
};

const SCORE_COLOR = (score) => {
  if (score >= 50) return 'text-red-400';
  if (score >= 20) return 'text-yellow-400';
  return 'text-green-400';
};

const SCORE_BG = (score) => {
  if (score >= 50) return 'bg-red-500';
  if (score >= 20) return 'bg-yellow-500';
  return 'bg-green-500';
};

export default function DiagnoseModal({ company, searchParams, onClose }) {
  // Prefere o diagnóstico do backend (com análise do site); fallback local.
  const localDiag = company.diagnostico || diagnoseCompany(company);
  const [aiDiag, setAiDiag] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [fonte, setFonte] = useState('');

  useEffect(() => {
    const prefs = (() => {
      try { return JSON.parse(localStorage.getItem('cacador_user_prefs') || '{}'); }
      catch { return {}; }
    })();

    api.diagnose({
      empresa: company,
      nicho: searchParams.nicho,
      cidade: searchParams.cidade,
      seuServico: prefs.seuServico || 'marketing digital e criação de sites',
    })
      .then((r) => r.json())
      .then((d) => {
        setAiDiag(d);
        setFonte(d.fonte);
      })
      .catch(() => setFonte('local'))
      .finally(() => setIsLoading(false));
  }, []);

  const pitch = aiDiag?.pitch || '';
  const servicos = aiDiag?.servicos || localDiag.servicos;
  const textoIA = aiDiag?.diagnostico?.textoIA || null;

  const handleCopyPitch = async () => {
    await navigator.clipboard.writeText(pitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const waPhone = (() => {
    const phone = company.telefone;
    if (!phone || phone === 'Não informado') return null;
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10 || digits.length === 11) return `55${digits}`;
    return digits.length >= 12 ? digits : null;
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-white font-bold text-lg">🧠 Diagnóstico de Oportunidade</h2>
            <p className="text-gray-400 text-sm mt-0.5">
              <span className="text-purple-400 font-medium">{company.nome}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors ml-4 text-xl leading-none">✕</button>
        </div>

        <div className="p-6 space-y-6">

          {/* Score visual */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1">Score de Oportunidade</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-bold ${SCORE_COLOR(localDiag.score)}`}>{localDiag.score}</span>
                  <span className="text-gray-500 text-sm">/100</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-xs mb-1">Nível</p>
                <span className={`text-xl font-bold ${SCORE_COLOR(localDiag.score)}`}>
                  {localDiag.nivel === 'Alta' ? '🔴' : localDiag.nivel === 'Média' ? '🟡' : '🟢'} {localDiag.nivel}
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-700 ${SCORE_BG(localDiag.score)}`}
                style={{ width: `${localDiag.score}%` }}
              />
            </div>
          </div>

          {/* Pontos fracos */}
          <div>
            <h3 className="text-gray-300 font-semibold text-sm mb-3">📋 Análise dos Pontos</h3>
            <div className="space-y-2">
              {localDiag.pontos.map((p, i) => {
                const s = TIPO_STYLE[p.tipo] || TIPO_STYLE.ok;
                return (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${s.bg}`}>
                    <span className="text-base mt-0.5 shrink-0">{p.icone}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{p.titulo}</p>
                      {p.tipo !== 'ok' && p.servico && (
                        <p className="text-xs opacity-60 mt-0.5">→ Serviço: {p.servico}</p>
                      )}
                    </div>
                    {p.tipo === 'critico' && (
                      <span className="ml-auto shrink-0 text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30 font-medium">
                        Crítico
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Serviços a oferecer */}
          {servicos.length > 0 && (
            <div>
              <h3 className="text-gray-300 font-semibold text-sm mb-3">💼 O que você pode oferecer</h3>
              <div className="flex flex-wrap gap-2">
                {servicos.map((s, i) => (
                  <span key={i} className="bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs px-3 py-1.5 rounded-full font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Diagnóstico IA */}
          {textoIA && (
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
              <p className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">🤖 Análise IA</p>
              <p className="text-gray-300 text-sm leading-relaxed">{textoIA}</p>
            </div>
          )}

          {/* Pitch */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 font-semibold text-sm">
                🎯 Pitch de Abordagem
                {fonte === 'openai' && (
                  <span className="ml-2 text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30">GPT-4o</span>
                )}
              </h3>
              {isLoading && (
                <span className="text-gray-500 text-xs animate-pulse">Gerando com IA...</span>
              )}
            </div>

            {isLoading ? (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 animate-pulse">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-700 rounded w-full" />
                  <div className="h-3 bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            ) : (
              <textarea
                value={pitch}
                onChange={(e) => setAiDiag((d) => ({ ...d, pitch: e.target.value }))}
                rows={5}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none leading-relaxed"
              />
            )}
          </div>

          {/* Ações */}
          <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-gray-800">
            <button
              onClick={handleCopyPitch}
              disabled={!pitch || isLoading}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              {copied ? '✅ Copiado!' : '📋 Copiar Pitch'}
            </button>

            {waPhone && pitch && (
              <button
                onClick={() => window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(pitch)}`, '_blank')}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                📲 Enviar pelo WhatsApp
              </button>
            )}

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 text-sm px-4 py-2.5 transition-colors ml-auto"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
