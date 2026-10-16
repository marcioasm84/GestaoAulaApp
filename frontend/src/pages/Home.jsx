import { Link } from 'react-router-dom';

const cards = [
  {
    to: '/professores',
    title: 'Professores',
    description: 'Cadastre professores e vincule as matérias que cada um pode lecionar.',
  },
  {
    to: '/materias',
    title: 'Matérias',
    description: 'Mantenha o catálogo de matérias oferecidas pela escola.',
  },
  {
    to: '/salas',
    title: 'Salas',
    description: 'Gerencie as salas disponíveis e suas capacidades.',
  },
  {
    to: '/tempos',
    title: 'Tempos',
    description: 'Defina os horários de aula disponíveis na grade.',
  },
  {
    to: '/turmas',
    title: 'Turmas',
    description: 'Monte turmas combinando professor, matéria, sala e tempo.',
  },
];

export default function Home() {
  return (
    <section>
      <div className="hero">
        <h2>Gestão de Aulas</h2>
        <p>Cadastre professores, matérias, salas e tempos de aula para depois montar as turmas.</p>
      </div>
      <div className="card-grid">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="card-link">
            <h3>{c.title}</h3>
            <p>{c.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
