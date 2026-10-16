const API_BASE = `${import.meta.env.BASE_URL}api/`;

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Erro na requisição (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  listProfessores: () => request('professores'),
  createProfessor: (data) => request('professores', { method: 'POST', body: JSON.stringify(data) }),
  updateProfessor: (id, data) => request(`professores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProfessor: (id) => request(`professores/${id}`, { method: 'DELETE' }),

  listSalas: () => request('salas'),
  createSala: (data) => request('salas', { method: 'POST', body: JSON.stringify(data) }),
  updateSala: (id, data) => request(`salas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSala: (id) => request(`salas/${id}`, { method: 'DELETE' }),

  listTempos: () => request('tempos'),
  createTempo: (data) => request('tempos', { method: 'POST', body: JSON.stringify(data) }),
  updateTempo: (id, data) => request(`tempos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTempo: (id) => request(`tempos/${id}`, { method: 'DELETE' }),

  listTurmas: () => request('turmas'),
  createTurma: (data) => request('turmas', { method: 'POST', body: JSON.stringify(data) }),
  deleteTurma: (id) => request(`turmas/${id}`, { method: 'DELETE' }),
};
