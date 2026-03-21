import { Link, useNavigate } from 'react-router-dom';
// 👇 1. Importamos tu nuevo componente buscador
import BuscadorGlobal from './BuscadorGlobal'; 

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Borramos el token y el usuario del navegador
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 2. Redirigimos al login
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-light mb-4 px-4 sticky-top" style={{
      /* Estilo Glassmorphism super premium */
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
      zIndex: 10
    }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* LADO IZQUIERDO: Logo / Branding */}
        <Link className="navbar-brand fw-bold mb-0" to="/" style={{
          background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          MedicApp Dashboard
        </Link>

        {/* 👇 CENTRO: El Buscador Global Inteligente 👇 */}
        {/* Usamos flex-grow-1 y justify-content-center para que quede perfectamente en el medio */}
        <div className="flex-grow-1 d-flex justify-content-center px-4">
            <BuscadorGlobal />
        </div>

        {/* LADO DERECHO: Botón de Salir */}
        <button onClick={handleLogout} className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2" style={{ borderRadius: '10px', padding: '6px 14px', fontWeight: '600', whiteSpace: 'nowrap' }}>
          <ion-icon name="log-out-outline" style={{ fontSize: '18px' }}></ion-icon> Cerrar Sesión
        </button>
        
      </div>
    </nav>
  );
};

export default Navbar;