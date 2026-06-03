/**
 * store.js
 * Acervo de leads persistido em localStorage. Acumula todas as empresas
 * encontradas nas buscas (de qualquer cidade) e guarda o estado de CRM de
 * cada uma: status, anotações e data do último contato.
 *
 * É a fonte da verdade do app: a busca alimenta o acervo, e tanto a aba
 * Contatos quanto o Top 10 leem daqui.
 */

const LEADS_KEY = 'cacador_leads_v1';
const LEGACY_STATUS_KEY = 'cacador_statuses';

const STATUS_CONTATADO = ['em_contato', 'contatado'];

function readMap() {
  try {
    return JSON.parse(localStorage.getItem(LEADS_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeMap(map) {
  localStorage.setItem(LEADS_KEY, JSON.stringify(map));
}

function readLegacyStatuses() {
  try {
    return JSON.parse(localStorage.getItem(LEGACY_STATUS_KEY) || '{}');
  } catch {
    return {};
  }
}

function nowISO() {
  return new Date().toISOString();
}

/** Todos os leads do acervo, como array. */
export function getLeads() {
  return Object.values(readMap());
}

/** Estatísticas por status sobre todo o acervo. */
export function getStats() {
  const leads = getLeads();
  return {
    total: leads.length,
    novo: leads.filter((l) => l.status === 'novo').length,
    em_contato: leads.filter((l) => l.status === 'em_contato').length,
    contatado: leads.filter((l) => l.status === 'contatado').length,
    descartado: leads.filter((l) => l.status === 'descartado').length,
  };
}

/**
 * As N melhores oportunidades do acervo (maior score), ignorando descartadas.
 */
export function getTopOportunidades(n = 10) {
  return getLeads()
    .filter((l) => l.status !== 'descartado')
    .sort((a, b) => (b.diagnostico?.score || 0) - (a.diagnostico?.score || 0))
    .slice(0, n);
}

/**
 * Mescla os resultados de uma busca no acervo, preservando o estado de CRM
 * (status, notas, data de contato) de leads já existentes. Retorna as empresas
 * já com o estado salvo aplicado, para a tela de busca refletir o acervo.
 */
export function upsertSearchResults(companies, origem = {}) {
  const map = readMap();
  const legacy = readLegacyStatuses();
  const ts = nowISO();

  const enriched = companies.map((c) => {
    const existing = map[c.id];
    const status = existing?.status || legacy[c.id] || c.status || 'novo';
    const lead = {
      // dados da empresa (sempre atualizados pela busca mais recente)
      id: c.id,
      nome: c.nome,
      telefone: c.telefone,
      site: c.site,
      endereco: c.endereco,
      avaliacao: c.avaliacao,
      totalAvaliacoes: c.totalAvaliacoes,
      categoria: c.categoria,
      diagnostico: c.diagnostico,
      site_info: c.site_info,
      // estado de CRM (preservado entre buscas)
      status,
      notas: existing?.notas || '',
      dataUltimoContato: existing?.dataUltimoContato || null,
      criadoEm: existing?.criadoEm || ts,
      atualizadoEm: ts,
      origem: existing?.origem || { nicho: origem.nicho || '', cidade: origem.cidade || '' },
    };
    map[c.id] = lead;
    return lead;
  });

  writeMap(map);
  return enriched;
}

/** Atualiza campos arbitrários de um lead. */
export function updateLead(id, patch) {
  const map = readMap();
  if (!map[id]) return null;
  map[id] = { ...map[id], ...patch, atualizadoEm: nowISO() };
  writeMap(map);
  return map[id];
}

/**
 * Define o status de um lead. Ao mover para "em contato"/"contatado" pela
 * primeira vez, registra automaticamente a data do último contato.
 */
export function setStatus(id, status) {
  const map = readMap();
  if (!map[id]) return null;
  const patch = { status };
  if (STATUS_CONTATADO.includes(status) && !map[id].dataUltimoContato) {
    patch.dataUltimoContato = nowISO();
  }
  map[id] = { ...map[id], ...patch, atualizadoEm: nowISO() };
  writeMap(map);
  return map[id];
}

export function setNotas(id, notas) {
  return updateLead(id, { notas });
}

/** Marca contato agora (atualiza a data do último contato). */
export function registrarContato(id) {
  return updateLead(id, { dataUltimoContato: nowISO() });
}

export function removeLead(id) {
  const map = readMap();
  delete map[id];
  writeMap(map);
}
