import { useEffect, useState } from 'react';

function emptyForm(fields) {
  return fields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {});
}

export default function EntityCrudPage({ title, fields, api }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(() => emptyForm(fields));
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    try {
      setItems(await api.list());
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.update(editingId, form);
      } else {
        await api.create(form);
      }
      setForm(emptyForm(fields));
      setEditingId(null);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setForm(fields.reduce((acc, f) => ({ ...acc, [f.name]: item[f.name] ?? '' }), {}));
  }

  function handleCancel() {
    setEditingId(null);
    setForm(emptyForm(fields));
  }

  async function handleDelete(id) {
    setError('');
    try {
      await api.remove(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <section>
      <h2>{title}</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="entity-form">
        {fields.map((f) => (
          <label key={f.name}>
            {f.label}
            <input
              type={f.type || 'text'}
              value={form[f.name]}
              onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
              required={f.required !== false}
            />
          </label>
        ))}
        <div className="form-actions">
          <button type="submit">{editingId ? 'Salvar' : 'Adicionar'}</button>
          {editingId && (
            <button type="button" onClick={handleCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <table>
        <thead>
          <tr>
            {fields.map((f) => (
              <th key={f.name}>{f.label}</th>
            ))}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {fields.map((f) => (
                <td key={f.name}>{item[f.name]}</td>
              ))}
              <td>
                <button onClick={() => handleEdit(item)}>Editar</button>
                <button onClick={() => handleDelete(item.id)}>Excluir</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={fields.length + 1}>Nenhum registro cadastrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
