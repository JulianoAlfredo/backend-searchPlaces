import { useState } from 'react';
import { LayoutGrid, List, Inbox } from 'lucide-react';
import KanbanView from './KanbanView';
import ContactsView from './ContactsView';

/**
 * Aba Contatos: alterna entre o quadro Kanban (funil interativo) e a lista.
 */
export default function ContactsTab(props) {
  const [layout, setLayout] = useState('quadro');
  const { leads } = props;

  if (!leads.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Inbox className="w-14 h-14 text-slate-700 mb-4" />
        <h2 className="text-xl font-semibold text-slate-400 mb-2">Nenhuma empresa salva ainda</h2>
        <p className="text-slate-600 max-w-sm text-sm">
          Na aba <span className="text-slate-400">Buscar</span>, clique em <span className="text-slate-400">Salvar</span> nas
          empresas que quiser acompanhar. Elas aparecem aqui no seu funil.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Funil de contatos</h2>
          <p className="text-slate-500 text-sm mt-0.5">{leads.length} empresa{leads.length !== 1 ? 's' : ''} no acervo</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-800/60 rounded-lg p-1 shrink-0">
          <ToggleBtn label="Quadro" icon={LayoutGrid} active={layout === 'quadro'} onClick={() => setLayout('quadro')} />
          <ToggleBtn label="Lista" icon={List} active={layout === 'lista'} onClick={() => setLayout('lista')} />
        </div>
      </div>

      {layout === 'quadro' ? <KanbanView {...props} /> : <ContactsView {...props} />}
    </div>
  );
}

function ToggleBtn({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
        active ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
      }`}
    >
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  );
}
