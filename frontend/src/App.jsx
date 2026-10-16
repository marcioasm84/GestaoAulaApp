import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Home from './pages/Home.jsx';
import Professores from './pages/Professores.jsx';
import Salas from './pages/Salas.jsx';
import Tempos from './pages/Tempos.jsx';
import Turmas from './pages/Turmas.jsx';

export default function App() {
  return (
    <div className="app">
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/professores" element={<Professores />} />
          <Route path="/salas" element={<Salas />} />
          <Route path="/tempos" element={<Tempos />} />
          <Route path="/turmas" element={<Turmas />} />
        </Routes>
      </main>
    </div>
  );
}
