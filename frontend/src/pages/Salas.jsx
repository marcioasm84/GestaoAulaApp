import EntityCrudPage from '../components/EntityCrudPage.jsx';
import { api } from '../api.js';

export default function Salas() {
  return (
    <EntityCrudPage
      title="Salas"
      fields={[
        { name: 'nome', label: 'Nome' },
        { name: 'capacidade', label: 'Capacidade', type: 'number', required: false },
      ]}
      api={{
        list: api.listSalas,
        create: api.createSala,
        update: api.updateSala,
        remove: api.deleteSala,
      }}
    />
  );
}
