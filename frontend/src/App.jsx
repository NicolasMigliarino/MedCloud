import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/Footer';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard'; 
import PacientesList from './components/PacientesList';
import PacientesForm from './components/PacientesForm';
import ProfesionalList from './components/ProfesionalList';
import ProfesionalForm from './components/ProfesionalForm';
import UsuariosList from './components/UsuariosList';
import UsuariosForm from './components/UsuariosForm';
import RolList from './components/RolList'; // ✅ Nombres correctos
import RolForm from './components/RolForm'; // ✅ Nombres correctos
import TurnosList from './components/TurnosList';
import HistorialClinico from './components/HistorialClinico';
import TurnosForm from './components/TurnosForm';

import ProtectedRoute from './components/ProtectedRoute';

// 🏗️ EL LAYOUT MAESTRO: Controla cuándo mostrar el Sidebar
const MainLayout = ({ children }) => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

 return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Si NO estamos en la pantalla de login, mostramos el menú lateral */}
      {!isLogin && <Sidebar />}
      
      {/* El contenido principal se empuja 260px a la derecha para hacerle espacio al Sidebar */}
      <div style={{ 
        flexGrow: 1, 
        marginLeft: isLogin ? '0' : '260px', 
        transition: 'margin 0.3s ease',
        width: '100%',
        display: 'flex',          // ✅ 1. Lo convertimos en flexbox
        flexDirection: 'column'   // ✅ 2. Lo ponemos en formato columna (arriba hacia abajo)
      }}>
        {!isLogin && <Navbar />}
        
        {/* ✅ 3. Le agregamos flexGrow: 1 para que ocupe todo el espacio libre y empuje el footer abajo */}
        <div className="container-fluid p-4" style={{ flexGrow: 1 }}> 
          {children}
        </div>

        {/* ✅ 4. Agregamos el Footer al final de la columna (no se muestra en el login) */}
        {!isLogin && <Footer />}
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      {/* 👇 AQUÍ ESTÁ LA MAGIA: Envolvemos las rutas con MainLayout 👇 */}
      <MainLayout>
        <Routes>
          {/* RUTA PÚBLICA */}
          <Route path="/login" element={<LoginPage />} />

          {/* ==========================================
              NIVEL 1: SOLO USUARIOS LOGUEADOS
              ========================================== */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            
            <Route path="/pacientes" element={<PacientesList />} />
            <Route path="/pacientes/nuevo" element={<PacientesForm />} />
            <Route path="/pacientes/editar/:id" element={<PacientesForm />} />
            
            <Route path="/turnos" element={<TurnosList />} />
            <Route path="/turnos/nuevo" element={<TurnosForm />} />
            <Route path="/turnos/editar/:id" element={<TurnosForm />} />
            <Route path="/pacientes/:paciente_id/historial" element={<HistorialClinico />} />
          </Route>

          {/* ==========================================
              NIVEL 2: ADMIN y RECEPCION
              ========================================== */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'RECEPCION']} />}>
            <Route path="/profesionales" element={<ProfesionalList />} />
            <Route path="/profesionales/nuevo" element={<ProfesionalForm />} />
            <Route path="/profesionales/editar/:id" element={<ProfesionalForm />} />
          </Route>

          {/* ==========================================
              NIVEL 3: SOLO ADMIN
              ========================================== */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/usuarios" element={<UsuariosList />} />
            <Route path="/usuarios/nuevo" element={<UsuariosForm />} />
            <Route path="/usuarios/editar/:id" element={<UsuariosForm />} />

            <Route path="/roles" element={<RolList />} />
            <Route path="/roles/nuevo" element={<RolForm />} />
            <Route path="/roles/editar/:id" element={<RolForm />} />
          </Route>

        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App;