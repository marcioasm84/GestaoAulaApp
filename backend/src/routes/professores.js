const express = require('express');
const { readAll, writeAll, nextId } = require('../db');

const router = express.Router();
const COLLECTION = 'professores';

function normalizeMateriaIds(materiaIds) {
  if (!Array.isArray(materiaIds)) return [];
  return [...new Set(materiaIds.map(Number))];
}

function materiasValidas(materiaIds) {
  const materias = readAll('materias');
  return materiaIds.every((id) => materias.some((m) => m.id === id));
}

function enrich(professor) {
  const materias = readAll('materias');
  const materiaIds = professor.materiaIds || [];
  return {
    ...professor,
    materiaIds,
    materias: materiaIds.map((id) => materias.find((m) => m.id === id)).filter(Boolean),
  };
}

router.get('/', (req, res) => {
  res.json(readAll(COLLECTION).map(enrich));
});

router.post('/', (req, res) => {
  const { nome, email, materiaIds } = req.body;
  if (!nome) return res.status(400).json({ error: 'nome é obrigatório' });

  const ids = normalizeMateriaIds(materiaIds);
  if (!materiasValidas(ids)) return res.status(400).json({ error: 'matéria inválida' });

  const items = readAll(COLLECTION);
  const item = { id: nextId(items), nome, email: email || '', materiaIds: ids };
  items.push(item);
  writeAll(COLLECTION, items);
  res.status(201).json(enrich(item));
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const items = readAll(COLLECTION);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'professor não encontrado' });

  const { nome, email, materiaIds } = req.body;
  const ids = materiaIds !== undefined ? normalizeMateriaIds(materiaIds) : items[index].materiaIds;
  if (!materiasValidas(ids)) return res.status(400).json({ error: 'matéria inválida' });

  items[index] = {
    ...items[index],
    nome: nome ?? items[index].nome,
    email: email ?? items[index].email,
    materiaIds: ids,
  };
  writeAll(COLLECTION, items);
  res.json(enrich(items[index]));
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const items = readAll(COLLECTION);
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) return res.status(404).json({ error: 'professor não encontrado' });

  writeAll(COLLECTION, filtered);
  res.status(204).end();
});

module.exports = router;
