/**
 * diagnose.js
 * Analisa os dados de uma empresa do Google Maps e retorna um diagnóstico
 * de oportunidades de prospecção — sem precisar de API externa.
 */

export function diagnoseCompany(company) {
  const pontos = [];
  let score = 0; // 0 = sem oportunidade, 100 = oportunidade máxima

  // ─── 1. Presença digital ───────────────────────────────────────────────────
  if (!company.site) {
    pontos.push({
      tipo: 'critico',
      icone: '🌐',
      titulo: 'Sem site próprio',
      descricao:
        'A empresa não tem site. Clientes que pesquisam online nunca vão encontrá-la — oportunidade direta de vender presença digital.',
      servico: 'Criação de site',
    });
    score += 35;
  } else {
    pontos.push({
      tipo: 'ok',
      icone: '✅',
      titulo: 'Tem site',
      descricao: `Possui site: ${company.site}`,
      servico: null,
    });
  }

  // ─── 2. Avaliações — volume ────────────────────────────────────────────────
  const reviews = company.totalAvaliacoes || 0;
  if (reviews === 0) {
    pontos.push({
      tipo: 'critico',
      icone: '⭐',
      titulo: 'Nenhuma avaliação no Google',
      descricao:
        'Sem avaliações, a empresa perde credibilidade. Consumidores confiam em reviews antes de comprar.',
      servico: 'Gestão de reputação online',
    });
    score += 25;
  } else if (reviews < 10) {
    pontos.push({
      tipo: 'alerta',
      icone: '⭐',
      titulo: `Poucas avaliações (${reviews})`,
      descricao:
        'Com menos de 10 avaliações, o Google não destaca o negócio nas buscas locais.',
      servico: 'Estratégia de reputação',
    });
    score += 15;
  } else if (reviews < 50) {
    pontos.push({
      tipo: 'alerta',
      icone: '⭐',
      titulo: `Avaliações abaixo do ideal (${reviews})`,
      descricao:
        'Concorrentes com 100+ avaliações aparecem primeiro no Google Maps.',
      servico: 'Gestão de Google Meu Negócio',
    });
    score += 8;
  }

  // ─── 3. Avaliações — nota ─────────────────────────────────────────────────
  const rating = company.avaliacao;
  if (rating !== null && rating !== undefined) {
    if (rating < 3.5) {
      pontos.push({
        tipo: 'critico',
        icone: '📉',
        titulo: `Nota crítica: ${rating}★`,
        descricao:
          'Nota abaixo de 3.5 afasta clientes ativamente. Precisam de uma estratégia urgente de recuperação de reputação.',
        servico: 'Gestão de crise de reputação',
      });
      score += 20;
    } else if (rating < 4.2) {
      pontos.push({
        tipo: 'alerta',
        icone: '📊',
        titulo: `Nota mediana: ${rating}★`,
        descricao:
          'Uma nota entre 4.2 e 5.0 aumenta em até 3x a taxa de conversão no Google Maps.',
        servico: 'Otimização de Google Meu Negócio',
      });
      score += 10;
    }
  } else {
    pontos.push({
      tipo: 'alerta',
      icone: '❓',
      titulo: 'Sem nota no Google',
      descricao: 'Empresa sem avaliações visíveis — invisível para novos clientes.',
      servico: 'Google Meu Negócio',
    });
    score += 12;
  }

  // ─── 4. Contato ──────────────────────────────────────────────────────────
  if (!company.telefone || company.telefone === 'Não informado') {
    pontos.push({
      tipo: 'alerta',
      icone: '📞',
      titulo: 'Sem telefone cadastrado',
      descricao:
        'Clientes não conseguem ligar diretamente do Google. Perda direta de leads.',
      servico: 'Otimização de perfil no Google',
    });
    score += 10;
  }

  // ─── 5. Score final ───────────────────────────────────────────────────────
  score = Math.min(score, 100);

  let nivel;
  let cor;
  if (score >= 50) {
    nivel = 'Alta';
    cor = 'vermelho';
  } else if (score >= 20) {
    nivel = 'Média';
    cor = 'amarelo';
  } else {
    nivel = 'Baixa';
    cor = 'verde';
  }

  const servicos = pontos
    .filter((p) => p.servico)
    .map((p) => p.servico);

  return { score, nivel, cor, pontos, servicos };
}

/**
 * Retorna os serviços que podem ser ofertados a essa empresa
 * em formato de texto para usar na mensagem.
 */
export function getOpportunityText(company) {
  const { pontos } = diagnoseCompany(company);
  const problemas = pontos.filter((p) => p.tipo !== 'ok');
  if (problemas.length === 0) return null;
  return problemas.map((p) => `• ${p.titulo}: ${p.descricao}`).join('\n');
}
