import EntityCrudPage from '../components/EntityCrudPage.jsx';
import { api } from '../api.js';

export default function Professores() {
  return (
    <EntityCrudPage
      title="Professores"
      fields={[
        { name: 'nome', label: 'Nome' },
        { name: 'email', label: 'E-mail', type: 'email', required: false },
      ]}
      api={{
        list: api.listProfessores,
        create: api.createProfessor,
        update: api.updateProfessor,
        remove: api.deleteProfessor,
      }}
    />
  );
}
