import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">🏥 MedicApp</Link>
        
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {/* SECCIÓN PACIENTES */}
            <li className="nav-item">
              <Link className="nav-link" to="/">Pacientes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/nuevo">➕ Paciente</Link>
            </li>

            {/* SEPARADOR VISUAL (Opcional) */}
            <li className="nav-item mx-2 text-secondary d-flex align-items-center">|</li>

            {/* SECCIÓN Profesionales (NUEVA) */}
            <li className="nav-item">
              <Link className="nav-link" to="/profesionales">Profesionales</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profesionales/nuevo">➕ Profesional</Link>
            </li>
                     {/* SECCIÓN Usuarios (NUEVA) */}
            <li className="nav-item">
              <Link className="nav-link" to="/usuarios">Usuarios</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/usuarios/nuevo">➕ Usuario</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;