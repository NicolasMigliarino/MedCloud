import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';

import PacientesList from './components/PacientesList';
import PacientesForm from './components/PacientesForm';

import ProfesionalList from './components/ProfesionalList';
import ProfesionalForm from './components/ProfesionalForm';

import UsuariosList from './components/UsuariosList';
import UsuariosForm from './components/UsuariosForm';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4"> {/* Agregué mt-4 para separar del navbar */}
        <Routes>
          <Route path="/usuarios" element={<UsuariosList />} />
          <Route path="/usuarios/nuevo" element={<UsuariosForm />} />
          <Route path="/usuarios/editar/:id" element={<UsuariosForm />} />

          {/* --- RUTAS DE PACIENTES --- */}
          <Route path="/" element={<PacientesList />} />
          <Route path="/nuevo" element={<PacientesForm />} />
          <Route path="/editar/:id" element={<PacientesForm />} />
          
          {/* --- RUTAS DE PROFESIONALES --- */}
          <Route path="/profesionales" element={<ProfesionalList />} />
          <Route path="/profesionales/nuevo" element={<ProfesionalForm />} />
          <Route path="/profesionales/editar/:id" element={<ProfesionalForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;