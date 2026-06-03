import { useState } from 'react';
import {
  X, Phone, Mail, MessageCircle, AtSign, ExternalLink, Globe, MapPin,
  Building2, Layers, CalendarPlus, CalendarCheck, Flame, Stethoscope,
  MessageSquare, Trash2, Tag,
} from 'lucide-react';
import { NIVEL_STYLE, scoreColor, getPontoIcon, TIPO_STYLE } from '../diagnose-ui';
import { STATUS_OPTIONS, STATUS_MAP } from '../status';

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return null;
  }
}

export default function LeadDetailModal({
  lead, onClose, onStatusChange, onNotasChange, onRegistrarContato, onRemove, onDiagnose, onGenerateMessage,
}) {
  const [status, setStatus] = useState(lead.status);
  const [notas, setNotas] = useState(lead.notas || '');
  const [dataContato, setDataContato] = useState(lead.dataUltimoContato);

  const diag = lead.diagnostico || {};
  const info = lead.site_info || {};
  const nivel = NIVEL_STYLE[diag.nivel] || NIVEL_STYLE.Frio;
  const statusCfg = STATUS_MAP[status] || STATUS_OPTIONS[0];

  const changeStatus = (v) => { setStatus(v); onStatusChange(lead.id, v); };
  const saveNotas = () => { if (notas !== (lead.notas || '')) onNotasChange(lead.id, notas); };
  const registrar = () => { onRegistrarContato(lead.id); setDataContato(new Date().toISOString()); };

  const pontosFracos = (diag.pontos || []).filter((p) => p.tipo !== 'ok');

  const contatos = [
    lead.telefone && lead.telefone !== 'Não informado' && { Icon: Phone, label: lead.telefone, href: `tel:${lead.telefone}` },
    info.email && { Icon: Mail, label: info.email, href: `mailto:${info.email}` },
    info.whatsapp && { Icon: MessageCircle, label: 'WhatsApp', href: `https://wa.me/${info.whatsapp}` },
    info.instagram && { Icon: AtSign, label: `@${info.instagram}`, href: `https://instagram.com/${info.instagram}` },
    lead.site && { Icon: ExternalLink, label: hostOf(lead.site), href: lead.site },
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-white font-bold text-lg truncate">{lead.nome}</h2>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${nivel.badge}`}>
                <Flame className="w-3 h-3" /> {diag.score ?? '—'} · {diag.nivel}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> {lead.categoria}
              {diag.setor && <span className="text-slate-600">· setor {diag.setor}</span>}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status + contato */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 text-xs font-medium uppercase tracking-wide mb-1.5">Status no funil</label>
              <select
                value={status}
                onChange={(e) => changeStatus(e.target.value)}
                className={`w-full bg-slate-800 border text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-500 ${statusCfg.badge}`}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-slate-800 text-slate-200">{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-500 text-xs font-medium uppercase tracking-wide mb-1.5">Último contato</label>
              <button
                onClick={registrar}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2.5 transition-colors"
              >
                {dataContato ? <CalendarCheck className="w-4 h-4 text-emerald-400" /> : <CalendarPlus className="w-4 h-4" />}
                {formatDate(dataContato) || 'Registrar contato agora'}
              </button>
            </div>
          </div>

          {/* Contatos / canais */}
          {contatos.length > 0 && (
            <div>
              <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">Contatos e canais</h3>
              <div className="flex flex-wrap gap-2">
                {contatos.map(({ Icon, label, href }, i) => (
                  <a key={i} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs px-3 py-1.5 rounded-lg transition-colors">
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Dados gerais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <InfoRow Icon={MapPin} label="Endereço" value={lead.endereco} />
            <InfoRow Icon={Building2} label="Origem" value={[lead.origem?.nicho, lead.origem?.cidade].filter(Boolean).join(' · ') || '—'} />
            {info.tecnologia && <InfoRow Icon={Layers} label="Plataforma do site" value={info.tecnologia} />}
            <InfoRow Icon={Globe} label="Site" value={lead.site ? hostOf(lead.site) : 'Sem site'} />
          </div>

          {/* Pontos do diagnóstico */}
          {pontosFracos.length > 0 && (
            <div>
              <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">Sinais de oportunidade ({pontosFracos.length})</h3>
              <div className="space-y-1.5">
                {pontosFracos.map((p, i) => {
                  const s = TIPO_STYLE[p.tipo] || TIPO_STYLE.ok;
                  const Icon = getPontoIcon(p);
                  return (
                    <div key={i} className={`flex items-center gap-2.5 p-2.5 rounded-lg border ${s.wrap}`}>
                      <Icon className={`w-4 h-4 shrink-0 ${s.icon}`} />
                      <span className="text-sm">{p.titulo}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Anotações */}
          <div>
            <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">Anotações</h3>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              onBlur={saveNotas}
              rows={3}
              placeholder="Histórico de conversas, próximos passos, observações..."
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none leading-relaxed placeholder-slate-600"
            />
          </div>

          {/* Ações */}
          <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-slate-800">
            <button onClick={() => onDiagnose(lead)} className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
              <Stethoscope className="w-4 h-4" /> Diagnóstico completo
            </button>
            <button onClick={() => onGenerateMessage(lead)} className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
              <MessageSquare className="w-4 h-4" /> Mensagem
            </button>
            <button onClick={() => { onRemove(lead.id); onClose(); }} className="inline-flex items-center gap-2 text-slate-500 hover:text-rose-400 text-sm px-4 py-2.5 transition-colors ml-auto">
              <Trash2 className="w-4 h-4" /> Remover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ Icon, label, value }) {
  return (
    <div className="flex items-start gap-2 bg-slate-800/40 border border-slate-700/40 rounded-lg p-2.5">
      <Icon className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-[11px] text-slate-500">{label}</p>
        <p className="text-slate-300 text-sm truncate">{value}</p>
      </div>
    </div>
  );
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
