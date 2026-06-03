import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'

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
    return res.json({ companies: DEMO_COMPANIES, demo: true })
  }

  try {
    const searchQuery = `${query} ${cidade}`
    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    // 1. Text Search — lista os places
    const textSearchRes = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      {
        params: { query: searchQuery, language: 'pt-BR', key: apiKey },
        timeout: 10000
      }
    )

    if (textSearchRes.data.status !== 'OK') {
      throw new Error(`Google Maps retornou: ${textSearchRes.data.status}`)
    }

    const places = textSearchRes.data.results.slice(0, 20)

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

    res.json({ companies, demo: false })
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
    seuServico = 'soluções digitais para empresas'
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

  // ─ Diagnóstico local (sem IA) ─────────────────────────────────────────────
  const localDiagnosis = gerarDiagnosticoLocal(empresa)

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

Meu serviço: ${seuServico || 'marketing digital e criação de sites'}
Nicho que prospecte: ${nicho || empresa.categoria}

Gere:
1. Um diagnóstico objetivo de 2-3 frases dos pontos fracos digitais desta empresa
2. Um pitch de 3-4 frases para abordagem inicial (tom consultivo, não vendedor)
3. Os 3 principais serviços que eu poderia oferecer para esta empresa

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

// ─── Helpers de diagnóstico local ────────────────────────────────────────────
function gerarDiagnosticoLocal(empresa) {
  const pontos = []
  let score = 0

  if (!empresa.site) {
    pontos.push({ tipo: 'critico', icone: '🌐', titulo: 'Sem site próprio', servico: 'Criação de site' })
    score += 35
  }

  const reviews = empresa.totalAvaliacoes || 0
  if (reviews === 0) {
    pontos.push({ tipo: 'critico', icone: '⭐', titulo: 'Nenhuma avaliação no Google', servico: 'Gestão de reputação' })
    score += 25
  } else if (reviews < 10) {
    pontos.push({ tipo: 'alerta', icone: '⭐', titulo: `Poucas avaliações (${reviews})`, servico: 'Reputação online' })
    score += 15
  } else if (reviews < 50) {
    pontos.push({ tipo: 'alerta', icone: '⭐', titulo: `Avaliações abaixo do ideal (${reviews})`, servico: 'Google Meu Negócio' })
    score += 8
  }

  const rating = empresa.avaliacao
  if (rating !== null && rating !== undefined) {
    if (rating < 3.5) {
      pontos.push({ tipo: 'critico', icone: '📉', titulo: `Nota crítica: ${rating}★`, servico: 'Gestão de crise de reputação' })
      score += 20
    } else if (rating < 4.2) {
      pontos.push({ tipo: 'alerta', icone: '📊', titulo: `Nota mediana: ${rating}★`, servico: 'Otimização de GMN' })
      score += 10
    }
  } else {
    pontos.push({ tipo: 'alerta', icone: '❓', titulo: 'Sem nota visível', servico: 'Google Meu Negócio' })
    score += 12
  }

  if (!empresa.telefone || empresa.telefone === 'Não informado') {
    pontos.push({ tipo: 'alerta', icone: '📞', titulo: 'Sem telefone cadastrado', servico: 'Perfil no Google' })
    score += 10
  }

  score = Math.min(score, 100)
  const nivel = score >= 50 ? 'Alta' : score >= 20 ? 'Média' : 'Baixa'
  const servicos = pontos.filter(p => p.servico).map(p => p.servico)

  return { score, nivel, pontos, servicos }
}

function gerarPitchLocal(empresa, diagnostico, seuServico, nicho, cidade) {
  const nome = empresa.nome.split(' ')[0]
  const fraquezas = diagnostico.pontos.filter(p => p.tipo !== 'ok')

  if (fraquezas.length === 0) {
    return `${nome}, vi que vocês têm uma boa presença digital. Trabalho com ${seuServico || 'marketing digital'} e posso ajudar a escalar ainda mais os resultados de ${empresa.nome} em ${cidade || 'sua cidade'}.`
  }

  const principais = fraquezas.slice(0, 2).map(p => p.titulo.toLowerCase()).join(' e ')
  return `${nome}, analisei a presença digital de ${empresa.nome} e identifiquei alguns pontos que podem estar limitando o crescimento: ${principais}. Trabalho com ${seuServico || 'soluções digitais'} para empresas de ${nicho || empresa.categoria} em ${cidade || 'sua cidade'} e já ajudei negócios similares a atrair mais clientes de forma previsível. Posso montar uma análise gratuita personalizada para vocês?`
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
