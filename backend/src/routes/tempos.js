const express = require('express');
const { readAll, writeAll, nextId } = require('../db');

const router = express.Router();
const COLLECTION = 'tempos';

router.get('/', (req, res) => {
  res.json(readAll(COLLECTION));
});

router.post('/', (req, res) => {
  const { diaSemana, horaInicio, horaFim } = req.body;
  if (!diaSemana || !horaInicio || !horaFim) {
    return res.status(400).json({ error: 'diaSemana, horaInicio e horaFim são obrigatórios' });
  }

  const items = readAll(COLLECTION);
  const item = { id: nextId(items), diaSemana, horaInicio, horaFim };
  items.push(item);
  writeAll(COLLECTION, items);
  res.status(201).json(item);
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const items = readAll(COLLECTION);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'tempo não encontrado' });

  const { diaSemana, horaInicio, horaFim } = req.body;
  items[index] = {
    ...items[index],
    diaSemana: diaSemana ?? items[index].diaSemana,
    horaInicio: horaInicio ?? items[index].horaInicio,
    horaFim: horaFim ?? items[index].horaFim,
  };
  writeAll(COLLECTION, items);
  res.json(items[index]);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const items = readAll(COLLECTION);
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) return res.status(404).json({ error: 'tempo não encontrado' });

  writeAll(COLLECTION, filtered);
  res.status(204).end();
});

module.exports = router;
