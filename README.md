# 🎯 Caçador de Clientes

MVP de prospecção inteligente via Google Maps.

## ⚡ Como rodar

### 1. Backend

```bash
cd backend
npm install

# Configure a API Key (opcional — sem ela roda em modo demonstração)
copy .env.example .env
# Edite o .env e coloque sua GOOGLE_MAPS_API_KEY

npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse: **http://localhost:5173**

---

## 🗝️ Configurar Google Maps API Key (para busca real)

1. Acesse: https://console.cloud.google.com/
2. Crie um projeto
3. Ative a **Places API**
4. Gere uma API Key
5. Adicione no arquivo `backend/.env`:

```
GOOGLE_MAPS_API_KEY=AIza...sua_chave_aqui
```

> **Sem a chave**, o sistema roda em **modo demonstração** com dados fictícios.

---

## ✅ Funcionalidades do MVP

- 🔍 Busca por nicho + cidade
- 📋 Lista: nome, telefone, site, endereço, avaliações, categoria
- 🏷️ Gestão de status (Novo / Em Contato / Contatado / Descartado)
- ✉️ Geração de mensagem personalizada por empresa
- 📲 Botão "Abrir no WhatsApp" direto
- 📥 Exportar resultados para CSV
- 💾 Status salvos no localStorage (sem banco de dados)

---

## 🗺️ Próximas versões

- [ ] Banco de dados (MySQL/PostgreSQL)
- [ ] IA para análise do site da empresa
- [ ] Pipeline de prospecção com funil
- [ ] Integração com CRM
- [ ] Envio automático de mensagens
