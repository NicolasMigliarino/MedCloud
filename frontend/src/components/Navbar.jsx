import { Link, useNavigate } from 'react-router-dom';

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
    <nav className="navbar navbar-light bg-white border-bottom shadow-sm mb-4 px-4 sticky-top">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand fw-bold text-primary" to="/">Dashboard</Link>
        
        <button onClick={handleLogout} className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2">
           <ion-icon name="log-out-outline" style={{ fontSize: '18px' }}></ion-icon> Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;