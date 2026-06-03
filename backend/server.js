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
      const d = gerarDiagnosticoLocal(c, null, query)
      return { ...c, diagnostico: d, site_info: null, _score: d.score, _nivel: d.nivel }
    })
    const demoFiltered = demoScored
      .filter(c => c._nivel !== 'Frio')
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
      const d = gerarDiagnosticoLocal(c, sitesSignals[i], query)
      return { ...c, diagnostico: d, site_info: sitesSignals[i]?.info || null, _score: d.score, _nivel: d.nivel }
    })
    const resultCompanies = scoredCompanies
      .filter(c => c._nivel !== 'Frio')
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

// ─── Destaques: Top oportunidades do Brasil (busca curada rotativa diária) ────
const NICHOS_ALTO_POTENCIAL = [
  'distribuidora', 'indústria', 'transportadora', 'atacadista', 'construtora',
  'clínica', 'concessionária', 'cooperativa', 'rede de ensino', 'logística',
  'importadora', 'supermercado', 'laboratório', 'frigorífico'
]
const CAPITAIS = [
  'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre',
  'Goiânia', 'Brasília', 'Salvador', 'Recife', 'Fortaleza', 'Campinas', 'Manaus'
]

// Seleção rotativa determinística (gira conforme o dia, sem aleatoriedade)
function selecaoDoDia(lista, n, offset) {
  const out = []
  for (let i = 0; i < n; i++) out.push(lista[(offset + i) % lista.length])
  return out
}

app.get('/api/highlights', async (req, res) => {
  if (!isApiKeyConfigured()) {
    const scored = DEMO_COMPANIES
      .map(c => ({ ...c, diagnostico: gerarDiagnosticoLocal(c, null, c.categoria), site_info: null, origem: { nicho: c.categoria, cidade: 'Demo' } }))
      .sort((a, b) => b.diagnostico.score - a.diagnostico.score)
      .slice(0, 10)
    return res.json({ companies: scored, demo: true, geradoEm: new Date().toISOString() })
  }

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    const dia = Math.floor(Date.now() / 86400000) // dia desde epoch → rotação diária
    const nichos = selecaoDoDia(NICHOS_ALTO_POTENCIAL, 3, dia)
    const cidades = selecaoDoDia(CAPITAIS, 3, dia * 2)
    const queries = nichos.map((nicho, i) => ({ nicho, cidade: cidades[i] }))

    // 1. Textsearch (1 página) por consulta curada
    const buscas = await Promise.all(queries.map(({ nicho, cidade }) =>
      axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: { query: `${nicho} ${cidade}`, language: 'pt-BR', key: apiKey },
        timeout: 10000
      }).then(r => ({ nicho, cidade, results: r.data.results || [] })).catch(() => ({ nicho, cidade, results: [] }))
    ))

    // 2. Candidatos preliminares (setor + porte), dedup por place_id
    const mapa = new Map()
    for (const { nicho, cidade, results } of buscas) {
      for (const p of results) {
        if (mapa.has(p.place_id)) continue
        const empresa = {
          id: p.place_id, nome: p.name, telefone: 'Não informado', site: null,
          endereco: p.formatted_address || 'Não informado',
          avaliacao: p.rating ?? null, totalAvaliacoes: p.user_ratings_total ?? 0,
          categoria: formatCategory(p.types || []), status: 'novo'
        }
        const prelim = gerarDiagnosticoLocal(empresa, null, nicho).score
        mapa.set(p.place_id, { empresa, nicho, cidade, prelim, types: p.types || [] })
      }
    }

    // 3. Enriquecer os melhores candidatos com details + análise de site
    const candidatos = [...mapa.values()].sort((a, b) => b.prelim - a.prelim).slice(0, 14)
    const enriquecidos = await Promise.all(candidatos.map(async (cand) => {
      try {
        const det = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
          params: { place_id: cand.empresa.id, fields: 'formatted_phone_number,website,formatted_address,types', language: 'pt-BR', key: apiKey },
          timeout: 8000
        })
        const d = det.data.result || {}
        const empresa = {
          ...cand.empresa,
          telefone: d.formatted_phone_number || 'Não informado',
          site: d.website || null,
          endereco: d.formatted_address || cand.empresa.endereco,
          categoria: formatCategory(d.types || cand.types)
        }
        const sinais = empresa.site ? await analisarSite(empresa.site) : null
        const diag = gerarDiagnosticoLocal(empresa, sinais, cand.nicho)
        return { ...empresa, diagnostico: diag, site_info: sinais?.info || null, origem: { nicho: cand.nicho, cidade: cand.cidade } }
      } catch {
        const diag = gerarDiagnosticoLocal(cand.empresa, null, cand.nicho)
        return { ...cand.empresa, diagnostico: diag, site_info: null, origem: { nicho: cand.nicho, cidade: cand.cidade } }
      }
    }))

    const companies = enriquecidos.sort((a, b) => b.diagnostico.score - a.diagnostico.score).slice(0, 10)
    res.json({ companies, demo: false, geradoEm: new Date().toISOString(), consultas: queries })
  } catch (err) {
    console.error('[highlights erro]', err.message)
    res.status(500).json({ error: `Erro ao gerar destaques: ${err.message}` })
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
  const localDiagnosis = gerarDiagnosticoLocal(empresa, sinaisSite, nicho)

  if (!openaiKey) {
    return res.json({
      diagnostico: localDiagnosis,
      pitch: gerarPitchLocal(empresa, localDiagnosis, seuServico, nicho, cidade),
      fonte: 'local',
    })
  }

  // ─ Diagnóstico com OpenAI ────────────────────────────────────────────────
  try {
    const prompt = `Você é um consultor especialista em vender SISTEMAS sob medida, automação e gestão para empresas (prospecção B2B). Também ofereço sites quando faz sentido.
Analise os dados desta empresa e gere um diagnóstico do potencial dela como cliente de sistemas:

Empresa: ${empresa.nome}
Categoria: ${empresa.categoria}
Cidade: ${cidade || 'não informada'}
Possui site: ${empresa.site ? 'SIM — ' + empresa.site : 'NÃO'}
Telefone: ${empresa.telefone || 'não informado'}
Avaliação Google Maps: ${empresa.avaliacao ? empresa.avaliacao + ' estrelas com ' + empresa.totalAvaliacoes + ' avaliações' : 'sem avaliações'}
Endereço: ${empresa.endereco}

Pontos fracos identificados automaticamente:
${localDiagnosis.pontos.filter(p => p.tipo !== 'ok').map(p => '- ' + p.titulo).join('\n') || '- Nenhum crítico identificado'}

Meu serviço: ${seuServico || 'sistemas sob medida, automação de processos e gestão (e sites quando útil)'}
Nicho que prospecto: ${nicho || empresa.categoria}

Gere:
1. Um diagnóstico objetivo de 2-3 frases sobre por que esta empresa é (ou não) um bom cliente para sistemas — considere o porte/volume, o setor e sinais de operação manual
2. Um pitch de 3-4 frases para abordagem inicial (tom consultivo, não vendedor), focando em sistemas, automação e gestão de processos — pode mencionar site quando fizer sentido; não mencione tráfego pago ou gestão de redes sociais
3. Os 3 principais serviços de sistema/automação (e site, se couber) que eu poderia oferecer para esta empresa

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

// Plataformas que são "construtor genérico" (argumento de venda de site próprio)
const CONSTRUTORES_GENERICOS = ['Wix', 'Squarespace', 'Webflow', 'Google Sites']

// Extrai contatos, plataforma e sinais de SEO do HTML já baixado.
function extrairInfoSite(html) {
  // ─ SEO on-page ─
  const temTitle = /<title[^>]*>\s*\S/i.test(html)
  const temDescription = /<meta[^>]+name=["']?description["']?[^>]*content=["']\s*\S/i.test(html)
  const temH1 = /<h1[\s>]/i.test(html)

  // ─ E-mail (mailto: tem prioridade; senão regex no corpo), filtrando lixo ─
  let email = null
  const mailto = html.match(/mailto:([^"'?\s>]+@[^"'?\s>]+)/i)
  if (mailto) email = mailto[1]
  if (!email) {
    const m = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    if (m) email = m[0]
  }
  if (email && (/\.(png|jpe?g|gif|webp|svg)$/i.test(email) || /(sentry|wixpress|example\.|@2x|\.domain)/i.test(email))) {
    email = null
  }

  // ─ WhatsApp ─
  let whatsapp = null
  const wa = html.match(/(?:wa\.me\/|api\.whatsapp\.com\/send\?phone=)(\+?\d{8,15})/i)
  if (wa) whatsapp = wa[1]

  // ─ Instagram (ignora caminhos que não são perfil) ─
  let instagram = null
  const ig = html.match(/instagram\.com\/([A-Za-z0-9_.]+)/i)
  if (ig && !['p', 'reel', 'reels', 'explore', 'accounts', 'stories'].includes(ig[1].toLowerCase())) {
    instagram = ig[1]
  }

  // ─ Plataforma / tecnologia ─
  let tecnologia = null
  const assinaturas = [
    [/wixstatic\.com|_wix|wix\.com/i, 'Wix'],
    [/cdn\.shopify\.com|Shopify\./i, 'Shopify'],
    [/nuvemshop|tiendanube/i, 'Nuvemshop'],
    [/squarespace/i, 'Squarespace'],
    [/webflow/i, 'Webflow'],
    [/sites\.google\.com|gstatic\.com\/sites/i, 'Google Sites'],
    [/elementor/i, 'WordPress + Elementor'],
    [/wp-content|wp-includes|wp-json/i, 'WordPress'],
  ]
  for (const [re, nome] of assinaturas) {
    if (re.test(html)) { tecnologia = nome; break }
  }

  return { email, whatsapp, instagram, tecnologia, seo: { temTitle, temDescription, temH1 } }
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
      return { acessivel: true, statusCode: 200, https: alvo.startsWith('https'), responsivo: false, tempoMs: Date.now() - inicio, anoCopyright: null, certProblema: false, ehRedeSocial: true, info: null }
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

    const info = extrairInfoSite(html)

    return { acessivel: resp.status < 400, statusCode: resp.status, https, responsivo, tempoMs, anoCopyright, certProblema, ehRedeSocial: false, info }
  } catch (err) {
    return { acessivel: false, statusCode: null, https: false, responsivo: false, tempoMs: Date.now() - inicio, anoCopyright: null, certProblema: false, ehRedeSocial: false, info: null, erro: err.code || err.message }
  }
}

// ─── Temperatura: potencial de comprar SISTEMA (não é fraqueza de site) ───────
// O sinal se inverte em relação a "vender site": queremos empresa estabelecida,
// de setor com operação complexa e com sinais de processos manuais.
const SETOR_ALTA = /distribuidor|atacad|atacarej|ind[uú]stria|industrial|f[áa]bric|fabril|metal[uú]rgic|usina|frigor[íi]fic|log[íi]stic|transportad|transporte rodovi|construtor|constru[çc][ãa]o civil|incorporador|hospital|cl[íi]nic|laborat[óo]rio|concession[áa]ri|cooperativ|importador|exportador|supermercad|faculdade|universidade|col[ée]gio|rede de ensino|agroind|agroneg|minerador|farmac[êe]utic|e-?commerce/i
const SETOR_MEDIA = /contabil|cont[áa]bil|advocac|advogad|jur[íi]dic|escrit[óo]rio|imobili[áa]ri|restaurante|academia|ag[êe]ncia|consultoria|engenharia|arquitetura|gr[áa]fic|oficina|autope[çc]a|odontol|com[ée]rcio|loja|varejo|hotel|pousada|marketing|escola/i

function complexidadeSetor(empresa, nichoHint = '') {
  const hay = `${empresa.categoria || ''} ${empresa.nome || ''} ${nichoHint || ''}`.toLowerCase()
  if (SETOR_ALTA.test(hay)) return { nome: 'Alta', score: 40 }
  if (SETOR_MEDIA.test(hay)) return { nome: 'Média', score: 22 }
  return { nome: 'Baixa', score: 6 }
}

// Volume de operação (proxy por avaliações): mais volume = mais processos a sistematizar
function porteTemperatura(reviews = 0) {
  if (reviews >= 200) return 25
  if (reviews >= 100) return 18
  if (reviews >= 50) return 12
  if (reviews >= 20) return 6
  return 0
}

// ─── Helpers de diagnóstico local ────────────────────────────────────────────
// sinaisSite (opcional) = resultado de analisarSite(); quando ausente, o site
// existente é tratado apenas como "tem site" (ex.: modo demonstração).
// nichoHint = termo da busca, ajuda a classificar o setor.
function gerarDiagnosticoLocal(empresa, sinaisSite = null, nichoHint = '') {
  const pontos = []
  let score = 0
  const anoAtual = new Date().getFullYear()
  const reviews = empresa.totalAvaliacoes || 0

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
      const info = sinaisSite.info
      if (info) {
        if (!info.seo.temTitle || !info.seo.temDescription) {
          pontos.push({ tipo: 'alerta', icone: '🔍', titulo: 'Site sem SEO básico (título/descrição ausentes)', descricao: 'Sem título e meta description bem definidos, o site perde posições no Google e atrai menos visitantes.', servico: 'Otimização de SEO on-page' })
          score += 8; siteOk = false
        }
        if (CONSTRUTORES_GENERICOS.includes(info.tecnologia)) {
          pontos.push({ tipo: 'alerta', icone: '🧩', titulo: `Site em construtor genérico (${info.tecnologia})`, descricao: 'Sites em construtores genéricos costumam ser lentos, limitados e iguais aos da concorrência — um site próprio profissional diferencia o negócio.', servico: 'Site próprio profissional' })
          score += 6; siteOk = false
        }
      }
      if (siteOk) {
        pontos.push({ tipo: 'ok', icone: '✅', titulo: 'Site sem problemas técnicos detectados', descricao: `Possui site funcional: ${empresa.site}`, servico: null })
      }
    }
  } else {
    pontos.push({ tipo: 'ok', icone: '✅', titulo: 'Tem site', descricao: `Possui site: ${empresa.site}`, servico: null })
  }

  // ─── 2. Setor — potencial de sistema (complexidade operacional) ───────────
  const setor = complexidadeSetor(empresa, nichoHint)
  if (setor.nome === 'Alta') {
    pontos.push({ tipo: 'alerta', icone: '🏭', titulo: 'Setor de operação complexa — forte candidato a sistema', descricao: 'Empresas deste setor lidam com estoque, equipe e processos que um sistema sob medida organiza e automatiza.', servico: 'Sistema de gestão sob medida' })
  }
  if (reviews >= 100) {
    pontos.push({ tipo: 'alerta', icone: '📈', titulo: `Alto volume de clientes (${reviews} avaliações)`, descricao: 'Volume alto costuma significar muitos processos manuais — terreno fértil para automação e sistemas.', servico: 'Automação de processos' })
  }

  // ─── 3. Contato ───────────────────────────────────────────────────────────
  if (!empresa.telefone || empresa.telefone === 'Não informado') {
    pontos.push({ tipo: 'alerta', icone: '📞', titulo: 'Sem telefone cadastrado', descricao: 'Sem telefone visível — sinal de cadastro/operação descuidada, que um sistema de contatos resolve.', servico: 'Cadastro e canais de contato' })
    score += 6
  }

  // ─── 4. Temperatura (potencial de comprar sistema) ────────────────────────
  // setor + porte (volume) + sinais de operação manual. O `score` acumulado nas
  // seções de site representa a evidência de operação não-sistematizada.
  const manual = Math.min(score, 25)
  const temperatura = Math.min(setor.score + porteTemperatura(reviews) + manual, 100)
  const nivel = temperatura >= 60 ? 'Quente' : temperatura >= 35 ? 'Morno' : 'Frio'
  const cor = temperatura >= 60 ? 'vermelho' : temperatura >= 35 ? 'amarelo' : 'verde'
  const servicos = [...new Set(pontos.filter(p => p.servico).map(p => p.servico))]

  return { score: temperatura, nivel, cor, pontos, servicos, setor: setor.nome }
}

function gerarPitchLocal(empresa, diagnostico, seuServico, nicho, cidade) {
  const nome = empresa.nome.split(' ')[0]
  const servico = seuServico || 'sistemas sob medida, automação e sites'
  const fraquezas = diagnostico.pontos.filter(p => p.tipo !== 'ok')

  if (fraquezas.length === 0) {
    return `${nome}, ${empresa.nome} parece bem estruturada. Trabalho com ${servico} e ajudo empresas a automatizar processos e ganhar eficiência operacional. Faz sentido a gente trocar uma ideia?`
  }

  const principais = fraquezas.slice(0, 2).map(p => p.titulo.toLowerCase()).join(' e ')
  return `${nome}, analisei a operação de ${empresa.nome} e vi pontos que podem estar custando tempo e clientes: ${principais}. Trabalho com ${servico} para empresas de ${nicho || empresa.categoria} em ${cidade || 'sua região'} e ajudo a organizar e automatizar o que hoje é feito na mão. Posso mostrar uma proposta personalizada?`
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
