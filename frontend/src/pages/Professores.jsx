import { useEffect, useState } from 'react';
import { api } from '../api.js';

const emptyForm = { nome: '', email: '', materiaIds: [] };

export default function Professores() {
  const [professores, setProfessores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  async function loadAll() {
    try {
      const [p, m] = await Promise.all([api.listProfessores(), api.listMaterias()]);
      setProfessores(p);
      setMaterias(m);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function toggleMateria(id) {
    setForm((prev) => ({
      ...prev,
      materiaIds: prev.materiaIds.includes(id)
        ? prev.materiaIds.filter((m) => m !== id)
        : [...prev.materiaIds, id],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.updateProfessor(editingId, form);
      } else {
        await api.createProfessor(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadAll();
    } catch (e) {
      setError(e.message);
    }
  }

  function handleEdit(professor) {
    setEditingId(professor.id);
    setForm({
      nome: professor.nome,
      email: professor.email || '',
      materiaIds: professor.materiaIds || [],
    });
  }

  function handleCancel() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleDelete(id) {
    setError('');
    try {
      await api.deleteProfessor(id);
      await loadAll();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <section>
      <h2>Professores</h2>
      {error && <p className="error">{error}</p>}
      {materias.length === 0 && (
        <p className="hint">Cadastre ao menos uma matéria para poder vinculá-la a um professor.</p>
      )}

      <form onSubmit={handleSubmit} className="entity-form">
        <label>
          Nome
          <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        </label>
        <label>
          E-mail
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <div className="field-group">
          <span className="field-group-label">Matérias</span>
          <div className="checkbox-list">
            {materias.map((m) => (
              <label key={m.id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={form.materiaIds.includes(m.id)}
                  onChange={() => toggleMateria(m.id)}
                />
                {m.nome}
              </label>
            ))}
            {materias.length === 0 && <span className="muted">Nenhuma matéria cadastrada.</span>}
          </div>
        </div>
        <div className="form-actions">
          <button type="submit">{editingId ? 'Salvar' : 'Adicionar'}</button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Matérias</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {professores.map((p) => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{p.email}</td>
              <td>
                {(p.materias || []).length > 0 ? (
                  <div className="chip-list">
                    {p.materias.map((m) => (
                      <span key={m.id} className="chip">
                        {m.nome}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="muted">—</span>
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(p)}>Editar</button>
                <button className="btn-danger" onClick={() => handleDelete(p.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {professores.length === 0 && (
            <tr>
              <td colSpan={4}>Nenhum registro cadastrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
