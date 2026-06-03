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
    message: isApiKeyConfigured()
      ? 'Google Maps API configurada ✅'
      : 'Modo demonstração ativo ⚠️  — configure GOOGLE_MAPS_API_KEY no .env'
  })
})

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
