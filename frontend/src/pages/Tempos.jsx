import EntityCrudPage from '../components/EntityCrudPage.jsx';
import { api } from '../api.js';

export default function Tempos() {
  return (
    <EntityCrudPage
      title="Tempos"
      fields={[
        { name: 'diaSemana', label: 'Dia da semana' },
        { name: 'horaInicio', label: 'Início', type: 'time' },
        { name: 'horaFim', label: 'Fim', type: 'time' },
      ]}
      api={{
        list: api.listTempos,
        create: api.createTempo,
        update: api.updateTempo,
        remove: api.deleteTempo,
      }}
    />
  );
}
