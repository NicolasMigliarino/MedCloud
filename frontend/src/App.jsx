import { useState, useEffect } from 'react';
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
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';


import ProtectedRoute from './components/ProtectedRoute';
import CajaControl from './components/CajaControl';
import CajaHistorial from './components/CajaHistorial';
import Liquidaciones from './components/Liquidaciones';

// 🏗️ EL LAYOUT MAESTRO: Controla cuándo mostrar el Sidebar
const MainLayout = ({ children }) => {
  const location = useLocation();
  const isLogin = location.pathname === '/login' 
    || location.pathname === '/forgot-password' 
    || location.pathname.startsWith('/reset-password');

  // 🌓 Sistema Temático (Light / Dark Mode)
  const [theme, setTheme] = useState(() => {
    const localTheme = localStorage.getItem('theme');
    if (localTheme) return localTheme;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 📱 Estado de Sidebar Mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cerrar sidebar mobile cuando cambia de ruta
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      /* 👇 Aesthetic Mesh Gradient Background 👇 */
      background: 'var(--bg-app)',
      position: 'relative',
      transition: 'background 0.3s ease'
    }}>
      {/* Elementos decorativos (Blobs) para el fondo */}
      {!isLogin && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-10%', left: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(167, 139, 250, 0.08) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(96, 165, 250, 0.08) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }} />
        </div>
      )}

      {/* Overlay para cerrar sidebar mobile al hacer click fuera */}
      {!isLogin && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(3px)',
            zIndex: 999
          }}
        />
      )}

      {/* Si NO estamos en la pantalla de login, mostramos el menú lateral */}
      {!isLogin && (
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
      )}

      {/* El contenido principal se empuja 260px a la derecha para hacerle espacio al Sidebar */}
      <div 
        className="main-content-wrapper"
        style={{
          flexGrow: 1,
          marginLeft: isLogin ? '0' : '260px',
          transition: 'margin 0.3s ease, margin-left 0.3s ease',
          width: '100%',
          display: 'flex',          // ✅ 1. Lo convertimos en flexbox
          flexDirection: 'column',  // ✅ 2. Lo ponemos en formato columna
          position: 'relative',
          zIndex: 1
        }}
      >
        {!isLogin && (
          <Navbar 
            theme={theme} 
            toggleTheme={toggleTheme} 
            setSidebarOpen={setSidebarOpen} 
          />
        )}

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
          {/* RUTAS PÚBLICAS */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* ==========================================
              NIVEL 1: SOLO USUARIOS LOGUEADOS (Cualquiera)
              ========================================== */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pacientes" element={<PacientesList />} />
            <Route path="/turnos" element={<TurnosList />} />
            <Route path="/turnos/nuevo" element={<TurnosForm />} />
            <Route path="/turnos/editar/:id" element={<TurnosForm />} />
          </Route>

          {/* ==========================================
              NIVEL 2: ADMIN y RECEPCIÓN
              ========================================== */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'RECEPCION']} />}>
            <Route path="/profesionales" element={<ProfesionalList />} />
            <Route path="/profesionales/nuevo" element={<ProfesionalForm />} />
            <Route path="/profesionales/editar/:id" element={<ProfesionalForm />} />
            <Route path="/pacientes/nuevo" element={<PacientesForm />} />
            <Route path="/pacientes/editar/:id" element={<PacientesForm />} />

            {/* 👇 Movimos Usuarios y Roles aquí según tu pedido 👇 */}
            <Route path="/usuarios" element={<UsuariosList />} />
            <Route path="/usuarios/nuevo" element={<UsuariosForm />} />
            <Route path="/usuarios/editar/:id" element={<UsuariosForm />} />
            <Route path="/roles" element={<RolList />} />
            <Route path="/roles/nuevo" element={<RolForm />} />
            <Route path="/roles/editar/:id" element={<RolForm />} />

            {/* 💵 Rutas de Caja Diaria y Liquidaciones 🧮 */}
            <Route path="/caja" element={<CajaControl />} />
            <Route path="/caja/historial" element={<CajaHistorial />} />
            <Route path="/liquidaciones" element={<Liquidaciones />} />
          </Route>

          {/* ==========================================
              NIVEL 3: SOLO PROFESIONALES (MÉDICOS)
              ========================================== */}
          <Route element={<ProtectedRoute allowedRoles={['MEDICO']} />}>
            {/* 👇 Solo los doctores pueden entrar a esta URL 👇 */}
            <Route path="/pacientes/:paciente_id/historial" element={<HistorialClinico />} />
          </Route>

        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App;