import { useEffect, useState } from 'react';
import { api } from '../api.js';

const emptyForm = { nome: '', professorId: '', materiaId: '', salaId: '', tempoId: '' };

export default function Turmas() {
  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [salas, setSalas] = useState([]);
  const [tempos, setTempos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  async function loadAll() {
    try {
      const [t, p, m, s, h] = await Promise.all([
        api.listTurmas(),
        api.listProfessores(),
        api.listMaterias(),
        api.listSalas(),
        api.listTempos(),
      ]);
      setTurmas(t);
      setProfessores(p);
      setMaterias(m);
      setSalas(s);
      setTempos(h);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const professorSelecionado = professores.find((p) => p.id === Number(form.professorId));
  const materiasDisponiveis =
    professorSelecionado && professorSelecionado.materias.length > 0 ? professorSelecionado.materias : materias;

  function handleProfessorChange(professorId) {
    const professor = professores.find((p) => p.id === Number(professorId));
    const materiaAindaValida =
      professor && professor.materias.some((m) => m.id === Number(form.materiaId));
    setForm({ ...form, professorId, materiaId: materiaAindaValida ? form.materiaId : '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.createTurma(form);
      setForm(emptyForm);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      await api.deleteTurma(id);
      await loadAll();
    } catch (e) {
      setError(e.message);
    }
  }

  function tempoLabel(tempo) {
    return tempo ? `${tempo.diaSemana} ${tempo.horaInicio}-${tempo.horaFim}` : '';
  }

  const semCadastros =
    professores.length === 0 || materias.length === 0 || salas.length === 0 || tempos.length === 0;

  return (
    <section>
      <h2>Turmas</h2>
      {error && <p className="error">{error}</p>}
      {semCadastros && (
        <p className="hint">
          Cadastre ao menos um professor, uma matéria, uma sala e um tempo antes de criar uma turma.
        </p>
      )}

      <form onSubmit={handleSubmit} className="entity-form">
        <label>
          Nome da turma
          <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        </label>
        <label>
          Professor
          <select
            value={form.professorId}
            onChange={(e) => handleProfessorChange(e.target.value)}
            required
          >
            <option value="">Selecione</option>
            {professores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </label>
        <label>
          Matéria
          <select
            value={form.materiaId}
            onChange={(e) => setForm({ ...form, materiaId: e.target.value })}
            required
          >
            <option value="">Selecione</option>
            {materiasDisponiveis.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sala
          <select value={form.salaId} onChange={(e) => setForm({ ...form, salaId: e.target.value })} required>
            <option value="">Selecione</option>
            {salas.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tempo
          <select value={form.tempoId} onChange={(e) => setForm({ ...form, tempoId: e.target.value })} required>
            <option value="">Selecione</option>
            {tempos.map((t) => (
              <option key={t.id} value={t.id}>
                {tempoLabel(t)}
              </option>
            ))}
          </select>
        </label>
        <div className="form-actions">
          <button type="submit" disabled={semCadastros}>
            Adicionar
          </button>
        </div>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Professor</th>
            <th>Matéria</th>
            <th>Sala</th>
            <th>Tempo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {turmas.map((t) => (
            <tr key={t.id}>
              <td>{t.nome}</td>
              <td>{t.professor?.nome}</td>
              <td>{t.materia?.nome}</td>
              <td>{t.sala?.nome}</td>
              <td>{tempoLabel(t.tempo)}</td>
              <td>
                <button className="btn-danger" onClick={() => handleDelete(t.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {turmas.length === 0 && (
            <tr>
              <td colSpan={6}>Nenhuma turma cadastrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
