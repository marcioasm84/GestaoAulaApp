const express = require('express');
const { readAll, writeAll, nextId } = require('../db');

const router = express.Router();
const COLLECTION = 'turmas';

function findById(collection, id) {
  return readAll(collection).find((i) => i.id === Number(id));
}

function enrich(turma) {
  return {
    ...turma,
    professor: findById('professores', turma.professorId) || null,
    sala: findById('salas', turma.salaId) || null,
    tempo: findById('tempos', turma.tempoId) || null,
  };
}

function conflito(items, { salaId, professorId, tempoId }, ignoreId) {
  return items.find(
    (t) =>
      t.id !== ignoreId &&
      t.tempoId === tempoId &&
      (t.salaId === salaId || t.professorId === professorId)
  );
}

router.get('/', (req, res) => {
  res.json(readAll(COLLECTION).map(enrich));
});

router.post('/', (req, res) => {
  const { nome, professorId, salaId, tempoId } = req.body;
  if (!nome || !professorId || !salaId || !tempoId) {
    return res.status(400).json({ error: 'nome, professorId, salaId e tempoId são obrigatórios' });
  }
  if (!findById('professores', professorId)) return res.status(400).json({ error: 'professor inválido' });
  if (!findById('salas', salaId)) return res.status(400).json({ error: 'sala inválida' });
  if (!findById('tempos', tempoId)) return res.status(400).json({ error: 'tempo inválido' });

  const items = readAll(COLLECTION);
  const dados = {
    nome,
    professorId: Number(professorId),
    salaId: Number(salaId),
    tempoId: Number(tempoId),
  };
  if (conflito(items, dados)) {
    return res.status(409).json({ error: 'sala ou professor já ocupado nesse tempo' });
  }

  const item = { id: nextId(items), ...dados };
  items.push(item);
  writeAll(COLLECTION, items);
  res.status(201).json(enrich(item));
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const items = readAll(COLLECTION);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'turma não encontrada' });

  const { nome, professorId, salaId, tempoId } = req.body;
  const dados = {
    nome: nome ?? items[index].nome,
    professorId: professorId !== undefined ? Number(professorId) : items[index].professorId,
    salaId: salaId !== undefined ? Number(salaId) : items[index].salaId,
    tempoId: tempoId !== undefined ? Number(tempoId) : items[index].tempoId,
  };
  if (!findById('professores', dados.professorId)) return res.status(400).json({ error: 'professor inválido' });
  if (!findById('salas', dados.salaId)) return res.status(400).json({ error: 'sala inválida' });
  if (!findById('tempos', dados.tempoId)) return res.status(400).json({ error: 'tempo inválido' });
  if (conflito(items, dados, id)) {
    return res.status(409).json({ error: 'sala ou professor já ocupado nesse tempo' });
  }

  items[index] = { ...items[index], ...dados };
  writeAll(COLLECTION, items);
  res.json(enrich(items[index]));
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const items = readAll(COLLECTION);
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) return res.status(404).json({ error: 'turma não encontrada' });

  writeAll(COLLECTION, filtered);
  res.status(204).end();
});

module.exports = router;
