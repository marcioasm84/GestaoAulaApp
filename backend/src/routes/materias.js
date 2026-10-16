const express = require('express');
const { readAll, writeAll, nextId } = require('../db');

const router = express.Router();
const COLLECTION = 'materias';

router.get('/', (req, res) => {
  res.json(readAll(COLLECTION));
});

router.post('/', (req, res) => {
  const { nome, descricao } = req.body;
  if (!nome) return res.status(400).json({ error: 'nome é obrigatório' });

  const items = readAll(COLLECTION);
  const item = { id: nextId(items), nome, descricao: descricao || '' };
  items.push(item);
  writeAll(COLLECTION, items);
  res.status(201).json(item);
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const items = readAll(COLLECTION);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'matéria não encontrada' });

  const { nome, descricao } = req.body;
  items[index] = {
    ...items[index],
    nome: nome ?? items[index].nome,
    descricao: descricao ?? items[index].descricao,
  };
  writeAll(COLLECTION, items);
  res.json(items[index]);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const items = readAll(COLLECTION);
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) return res.status(404).json({ error: 'matéria não encontrada' });

  writeAll(COLLECTION, filtered);
  res.status(204).end();
});

module.exports = router;
