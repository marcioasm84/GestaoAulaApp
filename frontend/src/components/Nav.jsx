import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Início', end: true },
  { to: '/professores', label: 'Professores' },
  { to: '/salas', label: 'Salas' },
  { to: '/tempos', label: 'Tempos' },
  { to: '/turmas', label: 'Turmas' },
];

export default function Nav() {
  return (
    <nav className="nav">
      <span className="nav-brand">Gestão de Aulas</span>
      <ul>
        {links.map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} end={link.end} className={({ isActive }) => (isActive ? 'active' : '')}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
