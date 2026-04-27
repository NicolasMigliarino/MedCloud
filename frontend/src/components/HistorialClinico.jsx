import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getLoggedInUser } from '../utils/auth';

const HistorialClinico = () => {
    const { paciente_id } = useParams(); 
    const [historiales, setHistoriales] = useState([]);
    
    // Lista de médicos para el menú de compartir
    const [profesionales, setProfesionales] = useState([]); 
    // Para saber qué menú desplegable está abierto
    const [menuCompartirAbierto, setMenuCompartirAbierto] = useState(null); 
    const [profesionalSeleccionado, setProfesionalSeleccionado] = useState('');

    // 👇 NUEVO ESTADO: Para guardar los archivos del paciente
    const [archivos, setArchivos] = useState([]);

    const usuarioLogueado = getLoggedInUser();
    const profesional_id = usuarioLogueado?.id; 
    
    const [nuevaEvolucion, setNuevaEvolucion] = useState({
        motivo: '',
        evolucion: '',
        diagnostico: '',
        tratamiento: ''
    });

    // 1. Cargar historial, lista de profesionales y ARCHIVOS al iniciar
    const fetchData = async () => {
        if (!profesional_id) return;
        try {
            // Traemos el historial
            const resHistorial = await axios.get(`http://localhost:3000/historial/paciente/${paciente_id}/profesional/${profesional_id}`);
            setHistoriales(resHistorial.data);

            // Traemos la lista de TODOS los profesionales para llenar el <select>
            const resProfesionales = await axios.get('http://localhost:3000/profesionales');
            setProfesionales(resProfesionales.data);

            // Traemos los estudios del paciente
            const resArchivos = await axios.get(`http://localhost:3000/archivos/${paciente_id}`);
            setArchivos(resArchivos.data);

        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [paciente_id, profesional_id]);

    const handleChange = (e) => {
        setNuevaEvolucion({ ...nuevaEvolucion, [e.target.name]: e.target.value });
    };

    // 2. Guardar nueva evolución
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/historial', {
                ...nuevaEvolucion,
                paciente_id: parseInt(paciente_id),
                profesional_id: parseInt(profesional_id), 
                turno_id: null 
            });
            Swal.fire({
                icon: 'success',
                title: '¡Guardado!',
                text: 'La evolución clínica se registró correctamente.',
                confirmButtonColor: '#0d6efd',
                timer: 2000 
            });

            setNuevaEvolucion({ motivo: '', evolucion: '', diagnostico: '', tratamiento: '' }); 
            fetchData(); 
        } catch (error) {
            console.error("Error al guardar:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Hubo un error al guardar la evolución.',
                confirmButtonColor: '#dc3545' 
            });
        }
    };

    // 3. Compartir
    const handleCompartir = async (historial_id) => {
        if (!profesionalSeleccionado) {
            return alert("Por favor, selecciona un colega de la lista.");
        }
        try {
            await axios.post('http://localhost:3000/historial/compartir', {
                historial_id: historial_id,
                profesional_invitado_id: parseInt(profesionalSeleccionado)
            });
            alert("¡Lectura compartida con éxito!");
            setMenuCompartirAbierto(null); 
            setProfesionalSeleccionado(''); 
        } catch (error) {
            console.error("Error al compartir:", error);
            alert("Error: " + (error.response?.data?.message || "No se pudo compartir"));
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-primary border-bottom pb-2">Historia Clínica del Paciente #{paciente_id}</h2>

            <div className="row">
                {/*LADO IZQUIERDO: REDACTAR EVOLUCIÓN E HISTORIAL (Ocupa 8 de 12 columnas) */}
                <div className="col-lg-8">
                    
                    <div className="card shadow-sm mb-5 border-primary">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">➕ Redactar Nueva Evolución</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Motivo de Consulta (Opcional)</label>
                                        <input type="text" name="motivo" className="form-control" value={nuevaEvolucion.motivo} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Diagnóstico Presuntivo (Opcional)</label>
                                        <input type="text" name="diagnostico" className="form-control" value={nuevaEvolucion.diagnostico} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Evolución Clínica *</label>
                                    <textarea name="evolucion" className="form-control" rows="4" required value={nuevaEvolucion.evolucion} onChange={handleChange} placeholder="Detalle aquí la evolución del paciente..."></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted">Tratamiento o Indicaciones (Opcional)</label>
                                    <textarea name="tratamiento" className="form-control" rows="2" value={nuevaEvolucion.tratamiento} onChange={handleChange}></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary w-100 fw-bold">💾 Guardar Registro Médico</button>
                            </form>
                        </div>
                    </div>

                    <h4 className="mb-3 text-secondary">Registros Previos</h4>
                    {historiales.length === 0 ? (
                        <div className="alert alert-info shadow-sm">No hay registros médicos disponibles para su visualización.</div>
                    ) : (
                        historiales.map((registro) => (
                            <div key={registro.id} className="card mb-3 border-secondary shadow-sm">
                                <div className="card-header bg-light d-flex justify-content-between align-items-start">
                                    <strong>📅 Fecha: {new Date(registro.fecha_registro).toLocaleDateString()}</strong>
                                    
                                    {registro.es_autor === true && (
                                        <div className="text-end" style={{ minWidth: '200px' }}>
                                            <button 
                                                className={`btn btn-sm ${menuCompartirAbierto === registro.id ? 'btn-secondary' : 'btn-outline-success'}`}
                                                onClick={() => setMenuCompartirAbierto(menuCompartirAbierto === registro.id ? null : registro.id)}
                                            >
                                                {menuCompartirAbierto === registro.id ? '❌ Cancelar' : '🤝 Compartir Lectura'}
                                            </button>
                                            
                                            {menuCompartirAbierto === registro.id && (
                                                <div className="mt-2 p-2 border rounded bg-white shadow-sm position-absolute" style={{ zIndex: 100, right: '15px' }}>
                                                    <select 
                                                        className="form-select form-select-sm mb-2"
                                                        value={profesionalSeleccionado}
                                                        onChange={(e) => setProfesionalSeleccionado(e.target.value)}
                                                    >
                                                        <option value="">Seleccione un colega...</option>
                                                        {profesionales
                                                            .filter(p => p.usuario_id !== profesional_id)
                                                            .map(p => (
                                                                <option key={p.id} value={p.id}>
                                                                    Dr/a. {p.nombre} {p.apellido} ({p.especialidad})
                                                                </option>
                                                            ))
                                                        }
                                                    </select>
                                                    <button 
                                                        className="btn btn-success btn-sm w-100"
                                                        onClick={() => handleCompartir(registro.id)}
                                                    >
                                                        ✅ Confirmar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="card-body bg-white">
                                    {registro.motivo && <p><strong>Motivo:</strong> {registro.motivo}</p>}
                                    <p className="border-start border-3 border-primary ps-3 py-1 bg-light"><strong>Evolución:</strong> {registro.evolucion}</p>
                                    {registro.diagnostico && <p><strong>Diagnóstico:</strong> <span className="badge bg-danger text-white">{registro.diagnostico}</span></p>}
                                    {registro.tratamiento && <p><strong>Tratamiento:</strong> {registro.tratamiento}</p>}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 🔵 LADO DERECHO: ARCHIVOS MÉDICOS (Ocupa 4 de 12 columnas) */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-info" style={{ position: 'sticky', top: '20px' }}>
                        <div className="card-header bg-info text-white d-flex align-items-center">
                            <h5 className="mb-0">📎 Estudios Médicos</h5>
                        </div>
                        <div className="card-body p-0">
                            {archivos.length === 0 ? (
                                <div className="p-4 text-center text-muted">
                                    <p className="mb-0">No hay estudios cargados para este paciente.</p>
                                </div>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {archivos.map(archivo => (
                                        <li key={archivo.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div style={{ overflow: 'hidden' }}>
                                                <small className="d-block fw-bold text-truncate" style={{ maxWidth: '180px' }} title={archivo.nombre_original}>
                                                    {archivo.nombre_original}
                                                </small>
                                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                    Subido: {new Date(archivo.fecha_subida).toLocaleDateString()}
                                                </small>
                                            </div>
                                            <a 
                                                href={`http://localhost:3000/uploads/${archivo.nombre_archivo}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-info rounded-pill px-3"
                                            >
                                                👁️ Ver
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="card-footer bg-light text-center text-muted" style={{ fontSize: '0.8rem' }}>
                            Los archivos deben ser cargados desde la recepción.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HistorialClinico;