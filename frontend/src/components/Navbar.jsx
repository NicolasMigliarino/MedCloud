import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ theme, toggleTheme, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMainPage = location.pathname === '/';

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
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--nav-border)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
      zIndex: 10,
      transition: 'background 0.3s ease, border-bottom 0.3s ease'
    }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* LADO IZQUIERDO: Hamburger (Mobile) & Logo / Branding */}
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn d-md-none p-0 border-0 me-2"
            style={{
              fontSize: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)',
              background: 'transparent'
            }}
          >
            <ion-icon name="menu-outline"></ion-icon>
          </button>

          {isMainPage && (
            <Link className="navbar-brand fw-bold mb-0" to="/" style={{
              background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>
              MedCloud Dashboard
            </Link>
          )}
        </div>

        {/* LADO DERECHO: Toggle Tema & Botón de Salir */}
        <div className="d-flex align-items-center gap-3">
          <button
            onClick={toggleTheme}
            className="btn btn-link p-2 d-flex align-items-center justify-content-center text-decoration-none border-0"
            style={{
              fontSize: '22px',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              background: 'var(--panel-bg-hover)',
              color: 'var(--text-main)',
              transition: 'background 0.3s ease, color 0.3s ease'
            }}
            title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
          >
            <ion-icon name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'}></ion-icon>
          </button>

          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2" style={{ borderRadius: '10px', padding: '6px 14px', fontWeight: '600', whiteSpace: 'nowrap' }}>
            <ion-icon name="log-out-outline" style={{ fontSize: '18px' }}></ion-icon> Cerrar Sesión
          </button>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;