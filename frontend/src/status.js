/**
 * status.js
 * Configuração compartilhada dos status de lead (rótulo, cor e ícone).
 */
import { Circle, MessagesSquare, CheckCircle2, Archive } from 'lucide-react';

export const STATUS_OPTIONS = [
  { value: 'novo', label: 'Novo', icon: Circle, badge: 'bg-sky-500/10 text-sky-300 border-sky-500/30', dot: 'bg-sky-400' },
  { value: 'em_contato', label: 'Em contato', icon: MessagesSquare, badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30', dot: 'bg-amber-400' },
  { value: 'contatado', label: 'Contatado', icon: CheckCircle2, badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
  { value: 'descartado', label: 'Descartado', icon: Archive, badge: 'bg-slate-500/10 text-slate-400 border-slate-500/30', dot: 'bg-slate-500' },
];

export const STATUS_MAP = Object.fromEntries(STATUS_OPTIONS.map((o) => [o.value, o]));
