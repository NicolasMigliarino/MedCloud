import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import PacientesList from './components/PacientesList';
import PacientesForm from './components/PacientesForm';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<PacientesList />} />
          <Route path="/nuevo" element={<PacientesForm />} />
          
          {/* NUEVA RUTA: Usamos el mismo componente Form pero con un parámetro :id */}
          <Route path="/editar/:id" element={<PacientesForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;