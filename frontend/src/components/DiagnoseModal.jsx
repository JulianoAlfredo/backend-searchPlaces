import { useState, useEffect } from 'react';
import {
  X, Brain, Target, ClipboardList, Briefcase, Sparkles, Copy, Check,
  MessageCircle, Mail, AtSign, Layers, Monitor, ExternalLink,
} from 'lucide-react';
import { diagnoseCompany } from '../diagnose';
import { getPontoIcon, TIPO_STYLE, scoreColor, scoreBg } from '../diagnose-ui';
import { api } from '../api';

const SOCIAL_RE = /instagram|facebook|linktr|wa\.me|tiktok|youtu/i;

function previewUrl(site) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(site)}?w=720&h=440`;
}

export default function DiagnoseModal({ company, searchParams, onClose }) {
  const localDiag = company.diagnostico || diagnoseCompany(company);
  const info = company.site_info;
  const temPreview = company.site && !SOCIAL_RE.test(company.site);

  const [aiDiag, setAiDiag] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [fonte, setFonte] = useState('');
  const [imgErro, setImgErro] = useState(false);

  useEffect(() => {
    const prefs = (() => {
      try { return JSON.parse(localStorage.getItem('cacador_user_prefs') || '{}'); }
      catch { return {}; }
    })();

    api.diagnose({
      empresa: company,
      nicho: searchParams.nicho,
      cidade: searchParams.cidade,
      seuServico: prefs.seuServico || 'criação de sites e sistemas web',
    })
      .then((r) => r.json())
      .then((d) => { setAiDiag(d); setFonte(d.fonte); })
      .catch(() => setFonte('local'))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const phone = info?.whatsapp || company.telefone;
    if (!phone || phone === 'Não informado') return null;
    const digits = String(phone).replace(/\D/g, '');
    if (digits.length === 10 || digits.length === 11) return `55${digits}`;
    return digits.length >= 12 ? digits : null;
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-start justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center">
              <Brain className="w-4.5 h-4.5" />
            </span>
            <div>
              <h2 className="text-white font-bold text-lg">Diagnóstico de oportunidade</h2>
              <p className="text-slate-400 text-sm mt-0.5">
                <span className="text-violet-400 font-medium">{company.nome}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Preview do site */}
          {temPreview && !imgErro && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-300 font-semibold text-sm flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-slate-500" /> Como o site se apresenta
                </h3>
                <a href={company.site} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 text-xs">
                  Abrir <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-800 aspect-[720/440]">
                <img
                  src={previewUrl(company.site)}
                  alt={`Pré-visualização de ${company.nome}`}
                  loading="lazy"
                  onError={() => setImgErro(true)}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <p className="text-slate-600 text-xs mt-1.5">A pré-visualização pode levar alguns segundos para gerar.</p>
            </div>
          )}

          {/* Score */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-1">Score de oportunidade</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-bold ${scoreColor(localDiag.score)}`}>{localDiag.score}</span>
                  <span className="text-slate-500 text-sm">/100</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-xs mb-1">Nível</p>
                <span className={`text-xl font-bold ${scoreColor(localDiag.score)}`}>{localDiag.nivel}</span>
              </div>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className={`h-2 rounded-full transition-all duration-700 ${scoreBg(localDiag.score)}`} style={{ width: `${localDiag.score}%` }} />
            </div>
          </div>

          {/* Contatos e tecnologia */}
          {info && (info.email || info.whatsapp || info.instagram || info.tecnologia) && (
            <div>
              <h3 className="text-slate-300 font-semibold text-sm mb-3">Contatos e tecnologia</h3>
              <div className="flex flex-wrap gap-2">
                {info.tecnologia && (
                  <span className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-300 border border-slate-700 text-xs px-3 py-1.5 rounded-full">
                    <Layers className="w-3.5 h-3.5" /> {info.tecnologia}
                  </span>
                )}
                {info.email && (
                  <a href={`mailto:${info.email}`} className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-300 border border-sky-500/20 text-xs px-3 py-1.5 rounded-full hover:bg-sky-500/20 transition-colors">
                    <Mail className="w-3.5 h-3.5" /> {info.email}
                  </a>
                )}
                {info.whatsapp && (
                  <a href={`https://wa.me/${info.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs px-3 py-1.5 rounded-full hover:bg-emerald-500/20 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                )}
                {info.instagram && (
                  <a href={`https://instagram.com/${info.instagram}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-pink-500/10 text-pink-300 border border-pink-500/20 text-xs px-3 py-1.5 rounded-full hover:bg-pink-500/20 transition-colors">
                    <AtSign className="w-3.5 h-3.5" /> @{info.instagram}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Pontos */}
          <div>
            <h3 className="text-slate-300 font-semibold text-sm mb-3 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-slate-500" /> Análise dos pontos
            </h3>
            <div className="space-y-2">
              {localDiag.pontos.map((p, i) => {
                const s = TIPO_STYLE[p.tipo] || TIPO_STYLE.ok;
                const Icon = getPontoIcon(p);
                return (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${s.wrap}`}>
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${s.icon}`} />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{p.titulo}</p>
                      {p.tipo !== 'ok' && p.servico && (
                        <p className="text-xs opacity-60 mt-0.5">Serviço sugerido: {p.servico}</p>
                      )}
                    </div>
                    {p.tipo === 'critico' && (
                      <span className="ml-auto shrink-0 text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30 font-medium">
                        Crítico
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Serviços */}
          {servicos.length > 0 && (
            <div>
              <h3 className="text-slate-300 font-semibold text-sm mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-500" /> O que você pode oferecer
              </h3>
              <div className="flex flex-wrap gap-2">
                {servicos.map((s, i) => (
                  <span key={i} className="bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs px-3 py-1.5 rounded-full font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Diagnóstico IA */}
          {textoIA && (
            <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4">
              <p className="text-violet-300 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Análise IA
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">{textoIA}</p>
            </div>
          )}

          {/* Pitch */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-300 font-semibold text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-slate-500" /> Pitch de abordagem
                {fonte === 'openai' && (
                  <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full border border-violet-500/30">GPT-4o</span>
                )}
              </h3>
              {isLoading && <span className="text-slate-500 text-xs animate-pulse">Gerando...</span>}
            </div>

            {isLoading ? (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 animate-pulse space-y-2">
                <div className="h-3 bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-700 rounded w-full" />
                <div className="h-3 bg-slate-700 rounded w-2/3" />
              </div>
            ) : (
              <textarea
                value={pitch}
                onChange={(e) => setAiDiag((d) => ({ ...d, pitch: e.target.value }))}
                rows={5}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none leading-relaxed"
              />
            )}
          </div>

          {/* Ações */}
          <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-slate-800">
            <button
              onClick={handleCopyPitch}
              disabled={!pitch || isLoading}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar pitch'}
            </button>

            {waPhone && pitch && (
              <button
                onClick={() => window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(pitch)}`, '_blank')}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Enviar pelo WhatsApp
              </button>
            )}

            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm px-4 py-2.5 transition-colors ml-auto">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
