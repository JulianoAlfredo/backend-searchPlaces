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
 * As N melhores oportunidades do acervo (maior score) que ainda NÃO foram
 * contatadas — exclui em contato, contatadas e descartadas. É o que abastece
 * o painel principal com empresas frescas para abordar.
 */
export function getTopOportunidades(n = 12) {
  return getLeads()
    .filter((l) => l.status === 'novo')
    .sort((a, b) => (b.diagnostico?.score || 0) - (a.diagnostico?.score || 0))
    .slice(0, n);
}

/** Indica se uma empresa já está salva no acervo. */
export function isSaved(id) {
  return !!readMap()[id];
}

/**
 * Aplica o estado salvo (sem gravar) aos resultados de uma busca: marca quais
 * já estão no acervo (`_saved`) e traz o status atual de quem está salvo. A
 * busca é efêmera — só entra no acervo via saveLead().
 */
export function applySavedState(companies) {
  const map = readMap();
  return companies.map((c) => {
    const existing = map[c.id];
    return existing
      ? { ...c, _saved: true, status: existing.status }
      : { ...c, _saved: false, status: 'novo' };
  });
}

/**
 * Salva (ou atualiza os dados de) uma empresa no acervo, iniciando o
 * rastreamento da sua situação. Preserva o estado de CRM se já existir.
 */
export function saveLead(company, origem = {}) {
  const map = readMap();
  const existing = map[company.id];
  const ts = nowISO();
  const lead = {
    id: company.id,
    nome: company.nome,
    telefone: company.telefone,
    site: company.site,
    endereco: company.endereco,
    avaliacao: company.avaliacao,
    totalAvaliacoes: company.totalAvaliacoes,
    categoria: company.categoria,
    diagnostico: company.diagnostico,
    site_info: company.site_info,
    status: existing?.status || 'novo',
    notas: existing?.notas || '',
    dataUltimoContato: existing?.dataUltimoContato || null,
    criadoEm: existing?.criadoEm || ts,
    atualizadoEm: ts,
    origem: existing?.origem || { nicho: origem.nicho || '', cidade: origem.cidade || '' },
  };
  map[company.id] = lead;
  writeMap(map);
  return lead;
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

// ─── Cache dos destaques diários (Top do Brasil) ──────────────────────────────
const HL_KEY = 'cacador_highlights_v1';

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

/** Retorna os destaques cacheados se forem de hoje; senão null. */
export function getCachedHighlights() {
  try {
    const c = JSON.parse(localStorage.getItem(HL_KEY) || 'null');
    return c && c.date === hoje() ? c.companies : null;
  } catch {
    return null;
  }
}

export function setCachedHighlights(companies) {
  localStorage.setItem(HL_KEY, JSON.stringify({ date: hoje(), companies }));
}
