import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';

import PacientesList from './components/PacientesList';
import PacientesForm from './components/PacientesForm';

import ProfesionalList from './components/ProfesionalList';
import ProfesionalForm from './components/ProfesionalForm';

import UsuariosList from './components/UsuariosList';
import UsuariosForm from './components/UsuariosForm';

import RolForm from './components/RolForm';
import RolList from './components/RolList';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container-fluid p-0">       
  
       <Routes>
          {/* --- RUTA DE LOGIN (La que te falta) --- */}
          <Route path="/login" element={<LoginPage />} /> {/* <--- 2. AGREGAR ESTA LÍNEA */}


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

          {/* --- RUTAS DE ROLES --- */}
          <Route path="/roles" element={<RolList />} />
          <Route path="/roles/nuevo" element={<RolForm />} />
          <Route path="/roles/editar/:id" element={<RolForm />} />


        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;