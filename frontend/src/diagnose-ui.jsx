/**
 * diagnose-ui.jsx
 * Mapeia cada ponto de diagnóstico (vindo do backend) a um ícone SVG do
 * lucide-react, com base em palavras-chave do título. Substitui os emojis
 * por uma identidade visual consistente e profissional.
 */
import {
  Globe, Link2, Unplug, ShieldAlert, Smartphone, Unlock, Timer,
  CalendarClock, Search, Blocks, Star, TrendingDown, BarChart3,
  HelpCircle, PhoneOff, CheckCircle2, AlertCircle,
} from 'lucide-react';

const REGRAS = [
  [/rede social|agregador|linktree/i, Link2],
  [/sem site/i, Globe],
  [/fora do ar/i, Unplug],
  [/certificado|ssl/i, ShieldAlert],
  [/responsivo|celular/i, Smartphone],
  [/https/i, Unlock],
  [/lento/i, Timer],
  [/desatualizado/i, CalendarClock],
  [/seo/i, Search],
  [/construtor/i, Blocks],
  [/nota crítica/i, TrendingDown],
  [/nota mediana|abaixo do ideal/i, BarChart3],
  [/sem nota/i, HelpCircle],
  [/avalia/i, Star],
  [/telefone/i, PhoneOff],
];

export function getPontoIcon(ponto) {
  if (ponto?.tipo === 'ok') return CheckCircle2;
  const titulo = ponto?.titulo || '';
  for (const [re, Icon] of REGRAS) {
    if (re.test(titulo)) return Icon;
  }
  return AlertCircle;
}

/** Estilo (cor) por severidade do ponto. */
export const TIPO_STYLE = {
  critico: { wrap: 'bg-rose-500/10 border-rose-500/20 text-rose-300', icon: 'text-rose-400' },
  alerta: { wrap: 'bg-amber-500/10 border-amber-500/20 text-amber-300', icon: 'text-amber-400' },
  ok: { wrap: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300', icon: 'text-emerald-400' },
};

/** Estilo do badge de nível de oportunidade. */
export const NIVEL_STYLE = {
  Alta: { badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30', dot: 'bg-rose-400' },
  'Média': { badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30', dot: 'bg-amber-400' },
  Baixa: { badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
};

export function scoreColor(score) {
  if (score >= 50) return 'text-rose-400';
  if (score >= 20) return 'text-amber-400';
  return 'text-emerald-400';
}

export function scoreBg(score) {
  if (score >= 50) return 'bg-rose-500';
  if (score >= 20) return 'bg-amber-500';
  return 'bg-emerald-500';
}
