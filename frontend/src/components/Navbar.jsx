import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">🏥 MedicApp</Link>
        
        {/* Botón hamburguesa para móviles */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            
            {/* SECCIÓN PACIENTES */}
            <li className="nav-item">
              <Link className="nav-link" to="/">Pacientes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/nuevo">➕ Paciente</Link>
            </li>

            {/* SEPARADOR */}
            <li className="nav-item mx-2 text-secondary d-flex align-items-center">|</li>

            {/* SECCIÓN PROFESIONALES */}
            <li className="nav-item">
              <Link className="nav-link" to="/profesionales">Profesionales</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profesionales/nuevo">➕ Profesional</Link>
            </li>

            {/* SEPARADOR */}
            <li className="nav-item mx-2 text-secondary d-flex align-items-center">|</li>
                  
            {/* SECCIÓN USUARIOS */}
            <li className="nav-item">
              <Link className="nav-link" to="/usuarios">Usuarios</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/usuarios/nuevo">➕ Usuario</Link>
            </li>

            {/* SEPARADOR */}
            <li className="nav-item mx-2 text-secondary d-flex align-items-center">|</li>

            {/* SECCIÓN ROLES (NUEVA) */}
            <li className="nav-item">
              <Link className="nav-link text-warning" to="/roles">Roles</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-warning" to="/roles/nuevo">➕ Rol</Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;