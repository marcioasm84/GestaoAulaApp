import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section>
      <h2>Gestão de Aulas</h2>
      <p>Cadastre professores, salas e tempos de aula para depois montar as turmas.</p>
      <ul>
        <li>
          <Link to="/professores">Professores</Link>
        </li>
        <li>
          <Link to="/salas">Salas</Link>
        </li>
        <li>
          <Link to="/tempos">Tempos</Link>
        </li>
        <li>
          <Link to="/turmas">Turmas</Link>
        </li>
      </ul>
    </section>
  );
}
