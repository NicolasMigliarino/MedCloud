import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BuscadorGlobal = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [resultados, setResultados] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Efecto de búsqueda con "Debounce" (espera 300ms antes de buscar)
    useEffect(() => {
        if (searchTerm.trim().length < 2) {
            setResultados([]);
            setShowDropdown(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                // 👇 Acá llama a tu nueva ruta del motor de búsqueda
                const response = await axios.get(`http://localhost:3000/pacientes/buscar/${searchTerm}`);
                setResultados(response.data);
                setShowDropdown(true);
            } catch (error) {
                console.error("Error buscando paciente:", error);
            } finally {
                setIsSearching(false);
            }
        }, 300); // Espera 300ms después de la última tecla

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Cerrar el buscador si hacen clic afuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectPaciente = (pacienteId) => {
        setSearchTerm(''); // Limpiamos el buscador
        setShowDropdown(false);
        // Navegamos directo al perfil del paciente
        navigate(`/pacientes/editar/${pacienteId}`);
    };

    return (
        <div ref={dropdownRef} style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            {/* Input del Buscador */}
            <div className="input-group">
                <span className="input-group-text bg-white border-end-0">🔍</span>
                <input
                    type="text"
                    className="form-control border-start-0 ps-0 shadow-none"
                    placeholder="Buscar paciente (DNI, Nombre, Apellido)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => { if (resultados.length > 0) setShowDropdown(true); }}
                />
                {isSearching && (
                    <span className="input-group-text bg-white border-0">
                        <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                    </span>
                )}
            </div>

            {/* Menú Desplegable con los resultados */}
            {showDropdown && (
                <ul 
                    className="dropdown-menu show shadow w-100 mt-1" 
                    style={{ position: 'absolute', zIndex: 1050, maxHeight: '300px', overflowY: 'auto', padding: '0' }}
                >
                    {resultados.length > 0 ? (
                        resultados.map((paciente) => (
                            <li key={paciente.id}>
                                <button 
                                    className="dropdown-item d-flex justify-content-between align-items-center border-bottom py-2"
                                    onClick={() => handleSelectPaciente(paciente.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div>
                                        <div className="fw-bold">{paciente.nombre} {paciente.apellido}</div>
                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>DNI: {paciente.dni}</div>
                                    </div>
                                    <span className="badge bg-primary rounded-pill">Ir ➡️</span>
                                </button>
                            </li>
                        ))
                    ) : (
                        <li><span className="dropdown-item text-muted text-center py-3">No se encontraron pacientes.</span></li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default BuscadorGlobal;