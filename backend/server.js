const express = require('express');
const cors = require('cors');

const professoresRouter = require('./src/routes/professores');
const salasRouter = require('./src/routes/salas');
const temposRouter = require('./src/routes/tempos');
const turmasRouter = require('./src/routes/turmas');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/professores', professoresRouter);
app.use('/api/salas', salasRouter);
app.use('/api/tempos', temposRouter);
app.use('/api/turmas', turmasRouter);

app.listen(PORT, () => {
  console.log(`API de gestão escolar escutando na porta ${PORT}`);
});

module.exports = app;
