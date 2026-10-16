import EntityCrudPage from '../components/EntityCrudPage.jsx';
import { api } from '../api.js';

export default function Materias() {
  return (
    <EntityCrudPage
      title="Matérias"
      fields={[
        { name: 'nome', label: 'Nome' },
        { name: 'descricao', label: 'Descrição', required: false },
      ]}
      api={{
        list: api.listMaterias,
        create: api.createMateria,
        update: api.updateMateria,
        remove: api.deleteMateria,
      }}
    />
  );
}
