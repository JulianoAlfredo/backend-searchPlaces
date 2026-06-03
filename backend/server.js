import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'
import https from 'https'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://juliano.jayrobackend.com.br',
      'https://www.juliano.jayrobackend.com.br',
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
)
app.use(express.json())
app.use((_, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  next()
})

const DEMO_COMPANIES = [
  {
    id: 'demo_1',
    nome: 'ABC Contabilidade Ltda',
    telefone: '(11) 3456-7890',
    site: 'https://www.abccontabilidade.com.br',
    endereco: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
    avaliacao: 4.5,
    totalAvaliacoes: 87,
    categoria: 'Escritório de Contabilidade',
    status: 'novo'
  },
  {
    id: 'demo_2',
    nome: 'Contábil Express',
    telefone: '(11) 9876-5432',
    site: null,
    endereco: 'Rua Augusta, 450 - Consolação, São Paulo - SP',
    avaliacao: 4.2,
    totalAvaliacoes: 43,
    categoria: 'Contador',
    status: 'novo'
  },
  {
    id: 'demo_3',
    nome: 'Grupo Fiscal Assessoria',
    telefone: '(11) 2233-4455',
    site: 'https://www.grupofiscal.com.br',
    endereco: 'Rua da Consolação, 800 - Consolação, São Paulo - SP',
    avaliacao: 4.8,
    totalAvaliacoes: 215,
    categoria: 'Escritório de Contabilidade',
    status: 'novo'
  },
  {
    id: 'demo_4',
    nome: 'Prime Contábil',
    telefone: '(11) 5544-3322',
    site: 'https://www.primecontabil.com.br',
    endereco: 'Av. Faria Lima, 2300 - Itaim Bibi, São Paulo - SP',
    avaliacao: 4.6,
    totalAvaliacoes: 132,
    categoria: 'Escritório de Contabilidade',
    status: 'novo'
  },
  {
    id: 'demo_5',
    nome: 'Nexus Assessoria Contábil',
    telefone: '(11) 9988-7766',
    site: null,
    endereco: 'Rua Vergueiro, 300 - Liberdade, São Paulo - SP',
    avaliacao: 3.9,
    totalAvaliacoes: 28,
    categoria: 'Contador',
    status: 'novo'
  },
  {
    id: 'demo_6',
    nome: 'TaxPro Contabilidade',
    telefone: '(11) 4455-6677',
    site: 'https://www.taxpro.com.br',
    endereco: 'Av. Brigadeiro Luís Antônio, 500 - Bela Vista, São Paulo - SP',
    avaliacao: 4.4,
    totalAvaliacoes: 76,
    categoria: 'Escritório de Contabilidade',
    status: 'novo'
  },
  {
    id: 'demo_7',
    nome: 'Contábil & Gestão Associados',
    telefone: '(11) 3322-1100',
    site: 'https://www.cga.com.br',
    endereco: 'Rua da Quitanda, 120 - Centro, São Paulo - SP',
    avaliacao: 4.7,
    totalAvaliacoes: 194,
    categoria: 'Escritório de Contabilidade',
    status: 'novo'
  },
  {
    id: 'demo_8',
    nome: 'Alfa Contábil',
    telefone: '(11) 8877-6655',
    site: null,
    endereco: 'Rua São Bento, 55 - Centro, São Paulo - SP',
    avaliacao: 4.0,
    totalAvaliacoes: 51,
    categoria: 'Contador',
    status: 'novo'
  },
  {
    id: 'demo_9',
    nome: 'Solução Contábil SP',
    telefone: '(11) 7766-5544',
    site: 'https://www.solucaocontabilsp.com.br',
    endereco: 'Av. Ipiranga, 6681 - Perdizes, São Paulo - SP',
    avaliacao: 4.3,
    totalAvaliacoes: 62,
    categoria: 'Escritório de Contabilidade',
    status: 'novo'
  },
  {
    id: 'demo_10',
    nome: 'Bravos Contabilidade',
    telefone: '(11) 6655-4433',
    site: 'https://www.bravoscontabil.com.br',
    endereco: 'Rua Joaquim Floriano, 100 - Itaim Bibi, São Paulo - SP',
    avaliacao: 4.9,
    totalAvaliacoes: 341,
    categoria: 'Escritório de Contabilidade',
    status: 'novo'
  },
  {
    id: 'demo_11',
    nome: 'JP Advocacia Empresarial',
    telefone: '(11) 9988-1122',
    site: null,
    endereco: 'Rua da Mooca, 300 - Mooca, São Paulo - SP',
    avaliacao: 3.8,
    totalAvaliacoes: 5,
    categoria: 'Advocacia',
    status: 'novo'
  },
  {
    id: 'demo_12',
    nome: 'Clínica São Lucas',
    telefone: null,
    site: null,
    endereco: 'Av. Celso Garcia, 1200 - Tatuapé, São Paulo - SP',
    avaliacao: null,
    totalAvaliacoes: 0,
    categoria: 'Clínica Médica',
    status: 'novo'
  },
  {
    id: 'demo_13',
    nome: 'Distribuidora Norte SP',
    telefone: '(11) 5566-7788',
    site: null,
    endereco: 'Rua Voluntários da Pátria, 500 - Santana, São Paulo - SP',
    avaliacao: 4.1,
    totalAvaliacoes: 18,
    categoria: 'Distribuidora',
    status: 'novo'
  },
  {
    id: 'demo_14',
    nome: 'Escola Futuro Brilhante',
    telefone: '(11) 3344-5566',
    site: null,
    endereco: 'Rua das Flores, 200 - Penha, São Paulo - SP',
    avaliacao: 4.3,
    totalAvaliacoes: 7,
    categoria: 'Escola',
    status: 'novo'
  },
  {
    id: 'demo_15',
    nome: 'Academia Power Fit',
    telefone: '(11) 9977-8866',
    site: 'https://www.powerfit.com.br',
    endereco: 'Av. Rebouças, 1800 - Pinheiros, São Paulo - SP',
    avaliacao: 3.2,
    totalAvaliacoes: 45,
    categoria: 'Academia',
    status: 'novo'
  },
  {
    id: 'demo_16',
    nome: 'Imobiliária Lar & Cia',
    telefone: '(11) 4433-2211',
    site: null,
    endereco: 'Rua Haddock Lobo, 600 - Cerqueira César, São Paulo - SP',
    avaliacao: 3.5,
    totalAvaliacoes: 12,
    categoria: 'Imobiliária',
    status: 'novo'
  },
  {
    id: 'demo_17',
    nome: 'Auto Peças Rápido',
    telefone: '(11) 7788-9900',
    site: null,
    endereco: 'Av. do Estado, 3000 - Brás, São Paulo - SP',
    avaliacao: 4.2,
    totalAvaliacoes: 3,
    categoria: 'Auto Peças',
    status: 'novo'
  },
  {
    id: 'demo_18',
    nome: 'Dentista Sorriso Perfeito',
    telefone: '(11) 6677-8899',
    site: null,
    endereco: 'Rua da Consolação, 1200 - Higienópolis, São Paulo - SP',
    avaliacao: null,
    totalAvaliacoes: 0,
    categoria: 'Dentista',
    status: 'novo'
  },
  {
    id: 'demo_19',
    nome: 'Construtora BetoCon',
    telefone: '(11) 5544-3311',
    site: 'https://betocon.com.br',
    endereco: 'Av. Eng. Luis Carlos Berrini, 1500 - Vila Olímpia, São Paulo - SP',
    avaliacao: 2.9,
    totalAvaliacoes: 8,
    categoria: 'Construção Civil',
    status: 'novo'
  },
  {
    id: 'demo_20',
    nome: 'Farmácia Popular SP',
    telefone: '(11) 3322-4455',
    site: null,
    endereco: 'Rua Domingos de Moraes, 800 - Vila Mariana, São Paulo - SP',
    avaliacao: 4.0,
    totalAvaliacoes: 34,
    categoria: 'Farmácia',
    status: 'novo'
  }
]

const isApiKeyConfigured = () => {
  const key = process.env.GOOGLE_MAPS_API_KEY
  return key && key !== 'your_google_maps_api_key_here'
}

const formatCategory = (types = []) => {
  const map = {
    accounting: 'Contabilidade',
    lawyer: 'Advocacia',
    real_estate_agency: 'Imobiliária',
    restaurant: 'Restaurante',
    beauty_salon: 'Salão de Beleza',
    gym: 'Academia',
    doctor: 'Médico',
    dentist: 'Dentista',
    school: 'Escola',
    store: 'Loja',
    establishment: 'Empresa',
    point_of_interest: 'Ponto de Interesse',
    finance: 'Financeiro',
    insurance_agency: 'Seguradora',
    travel_agency: 'Agência de Viagens'
  }
  for (const t of types) {
    if (map[t]) return map[t]
  }
  return types[0]?.replace(/_/g, ' ') || 'Empresa'
}

// ─── Rota: Buscar empresas ────────────────────────────────────────────────────
app.get('/api/search', async (req, res) => {
  const { query, cidade } = req.query

  if (!query || !cidade) {
    return res
      .status(400)
      .json({ error: 'Os parâmetros "query" e "cidade" são obrigatórios.' })
  }

  if (!isApiKeyConfigured()) {
    console.log('[DEMO] Retornando dados de demonstração...')
    const demoScored = DEMO_COMPANIES.map(c => {
      const d = gerarDiagnosticoLocal(c)
      return { ...c, diagnostico: d, _score: d.score, _nivel: d.nivel }
    })
    const demoFiltered = demoScored
      .filter(c => c._nivel !== 'Baixa')
      .sort((a, b) => b._score - a._score)
      .map(({ _score, _nivel, ...c }) => c)
    return res.json({ companies: demoFiltered, demo: true })
  }

  try {
    const searchQuery = `${query} ${cidade}`
    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    // 1. Text Search com paginação — busca até 2 páginas (40 resultados)
    let allResults = []
    let nextPageToken = null
    let page = 0

    do {
      const params = { query: searchQuery, language: 'pt-BR', key: apiKey }
      if (nextPageToken) params.pagetoken = nextPageToken

      const textSearchRes = await axios.get(
        'https://maps.googleapis.com/maps/api/place/textsearch/json',
        { params, timeout: 10000 }
      )

      if (textSearchRes.data.status !== 'OK' && page === 0) {
        throw new Error(`Google Maps retornou: ${textSearchRes.data.status}`)
      }

      if (textSearchRes.data.results) {
        allResults = [...allResults, ...textSearchRes.data.results]
      }

      nextPageToken = textSearchRes.data.next_page_token
      page++

      // Google exige delay de 2s entre páginas
      if (nextPageToken && page < 2) {
        await new Promise(r => setTimeout(r, 2000))
      }
    } while (nextPageToken && page < 2)

    const places = allResults

    // 2. Place Details — busca telefone e site de cada resultado
    const detailsPromises = places.map(place =>
      axios
        .get('https://maps.googleapis.com/maps/api/place/details/json', {
          params: {
            place_id: place.place_id,
            fields:
              'name,formatted_phone_number,website,formatted_address,rating,user_ratings_total,types',
            language: 'pt-BR',
            key: apiKey
          },
          timeout: 8000
        })
        .catch(() => ({ data: { result: {} } }))
    )

    const detailsResponses = await Promise.all(detailsPromises)

    const companies = detailsResponses.map((response, i) => {
      const d = response.data.result
      const p = places[i]
      return {
        id: p.place_id,
        nome: d.name || p.name,
        telefone: d.formatted_phone_number || 'Não informado',
        site: d.website || null,
        endereco: d.formatted_address || p.formatted_address || 'Não informado',
        avaliacao: d.rating ?? p.rating ?? null,
        totalAvaliacoes: d.user_ratings_total ?? p.user_ratings_total ?? 0,
        categoria: formatCategory(d.types || p.types || []),
        status: 'novo'
      }
    })

    // Analisa os sites em paralelo para qualificar sites ruins (não só "sem site")
    const sitesSignals = await Promise.all(
      companies.map(c => (c.site ? analisarSite(c.site) : Promise.resolve(null)))
    )

    // Filtra oportunidade Baixa e ordena por score (melhores primeiro)
    const scoredCompanies = companies.map((c, i) => {
      const d = gerarDiagnosticoLocal(c, sitesSignals[i])
      return { ...c, diagnostico: d, _score: d.score, _nivel: d.nivel }
    })
    const resultCompanies = scoredCompanies
      .filter(c => c._nivel !== 'Baixa')
      .sort((a, b) => b._score - a._score)
      .map(({ _score, _nivel, ...c }) => c)

    res.json({ companies: resultCompanies, demo: false })
  } catch (err) {
    console.error('[ERRO] Google Maps API:', err.message)
    res.status(500).json({
      error: `Erro ao buscar no Google Maps: ${err.message}. Verifique sua API Key.`
    })
  }
})

app.post('/api/message', (req, res) => {
  const {
    empresa,
    nicho = '',
    cidade = '',
    seuNome = '[Seu Nome]',
    seuServico = 'criação de sites e sistemas web'
  } = req.body

  if (!empresa) {
    return res.status(400).json({ error: 'Dados da empresa são obrigatórios.' })
  }

  const primeiroNomeEmpresa = empresa.nome.split(' ')[0]
  const avaliacaoTexto = empresa.avaliacao
    ? `Parabéns pelas ${empresa.avaliacao}⭐ no Google Maps com ${empresa.totalAvaliacoes} avaliações — isso mostra a qualidade do trabalho de vocês!`
    : 'Encontrei vocês no Google Maps e fiquei impressionado com a presença online.'

  const linhasSite = empresa.site
    ? `Visitei o site de vocês (${empresa.site}) e tenho algumas ideias de como poderiam atrair ainda mais clientes.`
    : `Notei que vocês ainda não têm um site ou presença digital forte — isso é uma oportunidade enorme que podemos explorar juntos.`

  const message =
    `Olá, ${primeiroNomeEmpresa}! 👋\n\n` +
    `Sou ${seuNome} e trabalho com ${seuServico}.\n\n` +
    `${avaliacaoTexto}\n\n` +
    `${linhasSite}\n\n` +
    `Ajudo empresas de ${nicho || empresa.categoria} em ${cidade || 'sua cidade'} a conseguir mais clientes de forma previsível — ` +
    `sem depender de indicações.\n\n` +
    `Posso fazer uma análise gratuita do seu negócio digital e mostrar exatamente o que está sendo deixado de faturar.\n\n` +
    `Teria 15 minutinhos para uma conversa rápida esta semana? 🤝\n\n` +
    `Att,\n${seuNome}`

  res.json({ message })
})

app.get('/api/health', (_, res) => {
  res.json({
    ok: true,
    demo: !isApiKeyConfigured(),
    hasOpenAI: !!(process.env.OPENAI_API_KEY),
    message: isApiKeyConfigured()
      ? 'Google Maps API configurada ✅'
      : 'Modo demonstração ativo ⚠️  — configure GOOGLE_MAPS_API_KEY no .env'
  })
})

// ─── Rota: Diagnóstico com IA (OpenAI opcional) ───────────────────────────────
app.post('/api/diagnose', async (req, res) => {
  const { empresa, nicho = '', cidade = '', seuServico = '' } = req.body

  if (!empresa) {
    return res.status(400).json({ error: 'Dados da empresa são obrigatórios.' })
  }

  const openaiKey = process.env.OPENAI_API_KEY

  // ─ Diagnóstico local (analisa o site, se houver) ──────────────────────────
  const sinaisSite = empresa.site ? await analisarSite(empresa.site) : null
  const localDiagnosis = gerarDiagnosticoLocal(empresa, sinaisSite)

  if (!openaiKey) {
    return res.json({
      diagnostico: localDiagnosis,
      pitch: gerarPitchLocal(empresa, localDiagnosis, seuServico, nicho, cidade),
      fonte: 'local',
    })
  }

  // ─ Diagnóstico com OpenAI ────────────────────────────────────────────────
  try {
    const prompt = `Você é um consultor de marketing digital especialista em prospecção B2B.
Analise os dados desta empresa e gere um diagnóstico de oportunidades:

Empresa: ${empresa.nome}
Categoria: ${empresa.categoria}
Cidade: ${cidade || 'não informada'}
Possui site: ${empresa.site ? 'SIM — ' + empresa.site : 'NÃO'}
Telefone: ${empresa.telefone || 'não informado'}
Avaliação Google Maps: ${empresa.avaliacao ? empresa.avaliacao + ' estrelas com ' + empresa.totalAvaliacoes + ' avaliações' : 'sem avaliações'}
Endereço: ${empresa.endereco}

Pontos fracos identificados automaticamente:
${localDiagnosis.pontos.filter(p => p.tipo !== 'ok').map(p => '- ' + p.titulo).join('\n') || '- Nenhum crítico identificado'}

Meu serviço: ${seuServico || 'criação de sites e sistemas web'}
Nicho que prospecto: ${nicho || empresa.categoria}

Gere:
1. Um diagnóstico objetivo de 2-3 frases dos pontos fracos digitais desta empresa
2. Um pitch de 3-4 frases para abordagem inicial (tom consultivo, não vendedor), focando APENAS em criação de site e sistemas — não mencione marketing digital, tráfego pago ou gestão de redes sociais
3. Os 3 principais serviços de site/sistema que eu poderia oferecer para esta empresa

Responda APENAS em JSON válido com esta estrutura:
{
  "diagnostico": "texto do diagnóstico...",
  "pitch": "texto do pitch...",
  "servicos": ["serviço 1", "serviço 2", "serviço 3"]
}`

    const openaiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    )

    const content = JSON.parse(openaiRes.data.choices[0].message.content)
    return res.json({
      diagnostico: { ...localDiagnosis, textoIA: content.diagnostico },
      pitch: content.pitch,
      servicos: content.servicos || localDiagnosis.servicos,
      fonte: 'openai',
    })
  } catch (err) {
    console.error('[OpenAI erro]', err.message)
    // Fallback para diagnóstico local se a IA falhar
    return res.json({
      diagnostico: localDiagnosis,
      pitch: gerarPitchLocal(empresa, localDiagnosis, seuServico, nicho, cidade),
      fonte: 'local_fallback',
      erro: 'OpenAI indisponível — usando análise local',
    })
  }
})

// ─── Análise de qualidade do site ────────────────────────────────────────────
// Domínios que NÃO são site próprio (rede social, agregadores de link, encurtadores)
const DOMINIOS_NAO_SITE = [
  'instagram.com', 'facebook.com', 'fb.com', 'fb.me', 'linktr.ee', 'linktree',
  'wa.me', 'api.whatsapp.com', 'whatsapp.com', 'bit.ly', 'linkedin.com',
  'twitter.com', 'x.com', 'tiktok.com', 'youtube.com', 'youtu.be',
  'beacons.ai', 'linkbio', 'about.me', 'campsite.bio', 'bio.link', 'sites.google.com'
]

// Códigos de erro que indicam problema de certificado/TLS (site existe, mas SSL falho)
const ERROS_TLS = new Set([
  'UNABLE_TO_GET_ISSUER_CERT_LOCALLY', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
  'CERT_HAS_EXPIRED', 'DEPTH_ZERO_SELF_SIGNED_CERT', 'SELF_SIGNED_CERT_IN_CHAIN',
  'ERR_TLS_CERT_ALTNAME_INVALID', 'EPROTO'
])

// Agente que ignora erros de certificado — usado só na 2ª tentativa, para
// conseguir ler o conteúdo de sites com SSL mal configurado (sem mascarar a falha).
const agenteInseguro = new https.Agent({ rejectUnauthorized: false })

function buscarHtml(alvo, httpsAgent) {
  return axios.get(alvo, {
    timeout: 5000,
    maxRedirects: 5,
    validateStatus: () => true,
    responseType: 'text',
    maxContentLength: 2 * 1024 * 1024,
    httpsAgent,
    // UA de navegador real reduz bloqueios de WAF (que gerariam falso "fora do ar")
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8'
    }
  })
}

// Faz um fetch rápido do site e extrai sinais de qualidade.
// Nunca lança — em qualquer falha retorna o site como inacessível.
async function analisarSite(url) {
  const inicio = Date.now()
  try {
    let alvo = String(url).trim()
    if (!/^https?:\/\//i.test(alvo)) alvo = 'https://' + alvo

    const hostname = new URL(alvo).hostname.replace(/^www\./i, '').toLowerCase()
    const ehRedeSocial = DOMINIOS_NAO_SITE.some(d => hostname === d || hostname.endsWith('.' + d) || hostname.includes(d))

    // Rede social: nem vale a pena baixar o HTML
    if (ehRedeSocial) {
      return { acessivel: true, statusCode: 200, https: alvo.startsWith('https'), responsivo: false, tempoMs: Date.now() - inicio, anoCopyright: null, certProblema: false, ehRedeSocial: true }
    }

    let resp
    let certProblema = false
    try {
      resp = await buscarHtml(alvo)
    } catch (err) {
      // Erro de TLS: o site existe, mas tem certificado problemático.
      // Tenta de novo ignorando o cert só para conseguir avaliar o conteúdo.
      if (ERROS_TLS.has(err.code)) {
        certProblema = true
        resp = await buscarHtml(alvo, agenteInseguro)
      } else {
        throw err
      }
    }

    const tempoMs = Date.now() - inicio
    const html = typeof resp.data === 'string' ? resp.data : ''
    const finalUrl = resp.request?.res?.responseUrl || alvo
    const https = /^https:/i.test(finalUrl)
    const responsivo = /<meta[^>]+name=["']?viewport["']?/i.test(html)

    // Ano de copyright no rodapé (pega o mais recente encontrado)
    const anos = [...html.matchAll(/(?:©|&copy;|copyright)[^0-9]{0,15}(20\d{2})/gi)].map(m => parseInt(m[1], 10))
    const anoCopyright = anos.length ? Math.max(...anos) : null

    return { acessivel: resp.status < 400, statusCode: resp.status, https, responsivo, tempoMs, anoCopyright, certProblema, ehRedeSocial: false }
  } catch (err) {
    return { acessivel: false, statusCode: null, https: false, responsivo: false, tempoMs: Date.now() - inicio, anoCopyright: null, certProblema: false, ehRedeSocial: false, erro: err.code || err.message }
  }
}

// ─── Helpers de diagnóstico local ────────────────────────────────────────────
// sinaisSite (opcional) = resultado de analisarSite(); quando ausente, o site
// existente é tratado apenas como "tem site" (ex.: modo demonstração).
function gerarDiagnosticoLocal(empresa, sinaisSite = null) {
  const pontos = []
  let score = 0
  const anoAtual = new Date().getFullYear()

  // ─── 1. Presença digital / qualidade do site ──────────────────────────────
  if (!empresa.site) {
    pontos.push({ tipo: 'critico', icone: '🌐', titulo: 'Sem site próprio', descricao: 'A empresa não tem site. Quem pesquisa online não a encontra — oportunidade direta de vender presença digital.', servico: 'Criação de site profissional' })
    score += 35
  } else if (sinaisSite) {
    if (sinaisSite.ehRedeSocial) {
      pontos.push({ tipo: 'critico', icone: '🔗', titulo: 'Usa apenas rede social/agregador de links', descricao: 'O "site" é um perfil de rede social ou Linktree, não um site próprio. Limita credibilidade e conversão.', servico: 'Site próprio profissional' })
      score += 30
    } else if (!sinaisSite.acessivel) {
      pontos.push({ tipo: 'critico', icone: '💀', titulo: 'Site fora do ar ou com erro', descricao: `O site não respondeu corretamente (${sinaisSite.statusCode ? 'status ' + sinaisSite.statusCode : 'sem resposta'}). Cada visitante perdido é um cliente a menos.`, servico: 'Reconstrução do site' })
      score += 25
    } else {
      let siteOk = true
      if (sinaisSite.certProblema) {
        pontos.push({ tipo: 'critico', icone: '🛡️', titulo: 'Certificado de segurança (SSL) com problema', descricao: 'O certificado do site é inválido ou está mal configurado — navegadores podem exibir alerta de "site não seguro", espantando clientes.', servico: 'Correção de SSL / novo site seguro' })
        score += 18; siteOk = false
      }
      if (!sinaisSite.responsivo) {
        pontos.push({ tipo: 'critico', icone: '📱', titulo: 'Site não responsivo (quebra no celular)', descricao: 'Sem adaptação para mobile, a maioria dos visitantes tem péssima experiência e abandona o site.', servico: 'Site responsivo (mobile-first)' })
        score += 20; siteOk = false
      }
      if (!sinaisSite.https) {
        pontos.push({ tipo: 'alerta', icone: '🔒', titulo: 'Site sem HTTPS (sem cadeado de segurança)', descricao: 'Navegadores marcam o site como "não seguro", o que afasta visitantes e prejudica o ranqueamento no Google.', servico: 'Migração para HTTPS' })
        score += 12; siteOk = false
      }
      if (sinaisSite.tempoMs > 3000) {
        pontos.push({ tipo: 'alerta', icone: '⏳', titulo: `Site lento (${(sinaisSite.tempoMs / 1000).toFixed(1)}s para abrir)`, descricao: 'Sites que demoram mais de 3s perdem boa parte dos visitantes antes de carregar.', servico: 'Otimização de performance' })
        score += 10; siteOk = false
      }
      if (sinaisSite.anoCopyright && sinaisSite.anoCopyright < anoAtual - 2) {
        pontos.push({ tipo: 'alerta', icone: '📅', titulo: `Site desatualizado (rodapé de ${sinaisSite.anoCopyright})`, descricao: 'Um site visivelmente antigo passa imagem de negócio parado e desatualizado.', servico: 'Modernização do site' })
        score += 8; siteOk = false
      }
      if (siteOk) {
        pontos.push({ tipo: 'ok', icone: '✅', titulo: 'Site sem problemas técnicos detectados', descricao: `Possui site funcional: ${empresa.site}`, servico: null })
      }
    }
  } else {
    pontos.push({ tipo: 'ok', icone: '✅', titulo: 'Tem site', descricao: `Possui site: ${empresa.site}`, servico: null })
  }

  // ─── 2. Avaliações — volume ───────────────────────────────────────────────
  const reviews = empresa.totalAvaliacoes || 0
  if (reviews === 0) {
    pontos.push({ tipo: 'critico', icone: '⭐', titulo: 'Nenhuma avaliação no Google', descricao: 'Sem avaliações, a empresa perde credibilidade. Consumidores confiam em reviews antes de comprar.', servico: 'Site com integração Google Meu Negócio' })
    score += 25
  } else if (reviews < 10) {
    pontos.push({ tipo: 'alerta', icone: '⭐', titulo: `Poucas avaliações (${reviews})`, descricao: 'Com menos de 10 avaliações, o Google não destaca o negócio nas buscas locais.', servico: 'Site com página de depoimentos' })
    score += 15
  } else if (reviews < 50) {
    pontos.push({ tipo: 'alerta', icone: '⭐', titulo: `Avaliações abaixo do ideal (${reviews})`, descricao: 'Concorrentes com 100+ avaliações aparecem primeiro no Google Maps.', servico: 'Site com integração de reviews' })
    score += 8
  }

  // ─── 3. Avaliações — nota ─────────────────────────────────────────────────
  const rating = empresa.avaliacao
  if (rating !== null && rating !== undefined) {
    if (rating < 3.5) {
      pontos.push({ tipo: 'critico', icone: '📉', titulo: `Nota crítica: ${rating}★`, descricao: 'Nota abaixo de 3.5 afasta clientes ativamente. Precisam de foco urgente em conversão.', servico: 'Novo site com foco em conversão' })
      score += 20
    } else if (rating < 4.2) {
      pontos.push({ tipo: 'alerta', icone: '📊', titulo: `Nota mediana: ${rating}★`, descricao: 'Uma nota entre 4.2 e 5.0 aumenta bastante a taxa de conversão no Google Maps.', servico: 'Modernização do site' })
      score += 10
    }
  } else {
    pontos.push({ tipo: 'alerta', icone: '❓', titulo: 'Sem nota visível', descricao: 'Empresa sem avaliações visíveis — quase invisível para novos clientes.', servico: 'Site com formulário de captação' })
    score += 12
  }

  // ─── 4. Contato ───────────────────────────────────────────────────────────
  if (!empresa.telefone || empresa.telefone === 'Não informado') {
    pontos.push({ tipo: 'alerta', icone: '📞', titulo: 'Sem telefone cadastrado', descricao: 'Clientes não conseguem ligar diretamente do Google. Perda direta de leads.', servico: 'Site com botão de contato/WhatsApp' })
    score += 10
  }

  // ─── 5. Score final ───────────────────────────────────────────────────────
  score = Math.min(score, 100)
  const nivel = score >= 50 ? 'Alta' : score >= 20 ? 'Média' : 'Baixa'
  const cor = score >= 50 ? 'vermelho' : score >= 20 ? 'amarelo' : 'verde'
  const servicos = pontos.filter(p => p.servico).map(p => p.servico)

  return { score, nivel, cor, pontos, servicos }
}

function gerarPitchLocal(empresa, diagnostico, seuServico, nicho, cidade) {
  const nome = empresa.nome.split(' ')[0]
  const fraquezas = diagnostico.pontos.filter(p => p.tipo !== 'ok')

  if (fraquezas.length === 0) {
    return `${nome}, vi que vocês têm uma boa presença digital. Trabalho com ${seuServico || 'criação de sites e sistemas'} e posso ajudar a evoluir ainda mais a presença online de ${empresa.nome} em ${cidade || 'sua cidade'}.`
  }

  const principais = fraquezas.slice(0, 2).map(p => p.titulo.toLowerCase()).join(' e ')
  return `${nome}, analisei a presença digital de ${empresa.nome} e identifiquei alguns pontos que podem estar limitando o crescimento: ${principais}. Trabalho com ${seuServico || 'criação de sites e sistemas'} para empresas de ${nicho || empresa.categoria} em ${cidade || 'sua cidade'} e já ajudei negócios similares a atrair mais clientes. Posso apresentar uma proposta personalizada para vocês?`
}

// ─── Export para Vercel (serverless) ─────────────────────────────────────────
export default app

// ─── Listen local (fora da Vercel) ───────────────────────────────────────────
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🎯 Caçador de Clientes — Backend`)
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
    if (!isApiKeyConfigured()) {
      console.log(
        '⚠️  GOOGLE_MAPS_API_KEY não configurada — rodando em modo demonstração'
      )
      console.log(
        '   Copie backend/.env.example para backend/.env e adicione sua chave.\n'
      )
    } else {
      console.log('✅ Google Maps API configurada — busca real ativada\n')
    }
  })
}
