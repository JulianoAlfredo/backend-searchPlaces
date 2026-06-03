// URL base da API — usa variável de ambiente em produção, proxy local em dev
const API_BASE = import.meta.env.VITE_API_URL || '';

export const api = {
  health: () => fetch(`${API_BASE}/api/health`),

  search: (query, cidade) =>
    fetch(`${API_BASE}/api/search?query=${encodeURIComponent(query)}&cidade=${encodeURIComponent(cidade)}`),

  message: (body) =>
    fetch(`${API_BASE}/api/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),

  diagnose: (body) =>
    fetch(`${API_BASE}/api/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
};
