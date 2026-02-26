import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const HistorialClinico = () => {
    const { paciente_id } = useParams(); 
    const [historiales, setHistoriales] = useState([]);
    
    // Lista de médicos para el menú de compartir
    const [profesionales, setProfesionales] = useState([]); 
    // Para saber qué menú desplegable está abierto
    const [menuCompartirAbierto, setMenuCompartirAbierto] = useState(null); 
    const [profesionalSeleccionado, setProfesionalSeleccionado] = useState('');

    const usuarioLogueado = JSON.parse(localStorage.getItem('user'));
    const profesional_id = usuarioLogueado?.id; 
    
    const [nuevaEvolucion, setNuevaEvolucion] = useState({
        motivo: '',
        evolucion: '',
        diagnostico: '',
        tratamiento: ''
    });

    // 1. Cargar historial y lista de profesionales al iniciar
    const fetchData = async () => {
        if (!profesional_id) return;
        try {
            // Traemos el historial
            const resHistorial = await axios.get(`http://localhost:3000/historial/paciente/${paciente_id}/profesional/${profesional_id}`);
            setHistoriales(resHistorial.data);

            // Traemos la lista de TODOS los profesionales para llenar el <select>
            const resProfesionales = await axios.get('http://localhost:3000/profesionales');
            setProfesionales(resProfesionales.data);
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
            // 🌟 NUEVA ALERTA DE ÉXITO
            Swal.fire({
                icon: 'success',
                title: '¡Guardado!',
                text: 'La evolución clínica se registró correctamente.',
                confirmButtonColor: '#0d6efd', // Color azul de Bootstrap
                timer: 2000 // Se cierra sola a los 2 segundos
            });

            setNuevaEvolucion({ motivo: '', evolucion: '', diagnostico: '', tratamiento: '' }); 
            fetchData(); 
        } catch (error) {
            console.error("Error al guardar:", error);
            
            // 🚨 NUEVA ALERTA DE ERROR
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Hubo un error al guardar la evolución.',
                confirmButtonColor: '#dc3545' // Color rojo de Bootstrap
            });
        }
    };

    // 3. LA NUEVA MAGIA: Enviar el permiso a la BD
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
            setMenuCompartirAbierto(null); // Cerramos el menú
            setProfesionalSeleccionado(''); // Limpiamos la selección
        } catch (error) {
            console.error("Error al compartir:", error);
            // Si el backend lanza nuestro error 51004 (Ya lo tiene), lo mostramos lindo
            alert("Error: " + (error.response?.data?.message || "No se pudo compartir"));
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Historia Clínica del Paciente #{paciente_id}</h2>

            <div className="card shadow-sm mb-5">
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
                            <textarea name="evolucion" className="form-control" rows="4" required value={nuevaEvolucion.evolucion} onChange={handleChange}></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted">Tratamiento o Indicaciones (Opcional)</label>
                            <textarea name="tratamiento" className="form-control" rows="2" value={nuevaEvolucion.tratamiento} onChange={handleChange}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Guardar Registro Médico</button>
                    </form>
                </div>
            </div>

            <h4 className="mb-3">Registros Previos</h4>
            {historiales.length === 0 ? (
                <div className="alert alert-info">No hay registros médicos disponibles para su visualización.</div>
            ) : (
                historiales.map((registro) => (
                    <div key={registro.id} className="card mb-3 border-secondary">
                        <div className="card-header bg-light d-flex justify-content-between align-items-start">
                            <strong>Fecha: {new Date(registro.fecha_registro).toLocaleDateString()}</strong>
                            
                            {/* CAJA DEL BOTÓN COMPARTIR Y MENÚ DESPLEGABLE */}
                            {registro.es_autor === true && (
                                <div className="text-end" style={{ minWidth: '200px' }}>
                                    <button 
                                        className={`btn btn-sm ${menuCompartirAbierto === registro.id ? 'btn-secondary' : 'btn-outline-success'}`}
                                        onClick={() => setMenuCompartirAbierto(menuCompartirAbierto === registro.id ? null : registro.id)}
                                    >
                                        {menuCompartirAbierto === registro.id ? '❌ Cancelar' : '🤝 Compartir Lectura'}
                                    </button>
                                    
                                    {/* Si este es el menú abierto, mostramos el selector */}
                                    {menuCompartirAbierto === registro.id && (
                                        <div className="mt-2 p-2 border rounded bg-white shadow-sm">
                                            <select 
                                                className="form-select form-select-sm mb-2"
                                                value={profesionalSeleccionado}
                                                onChange={(e) => setProfesionalSeleccionado(e.target.value)}
                                            >
                                                <option value="">Seleccione un colega...</option>
                                                {profesionales
                                                    .filter(p => p.usuario_id !== profesional_id) // Escondemos al usuario actual
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
                        <div className="card-body">
                            {registro.motivo && <p><strong>Motivo:</strong> {registro.motivo}</p>}
                            <p><strong>Evolución:</strong> {registro.evolucion}</p>
                            {registro.diagnostico && <p><strong>Diagnóstico:</strong> {registro.diagnostico}</p>}
                            {registro.tratamiento && <p><strong>Tratamiento:</strong> {registro.tratamiento}</p>}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default HistorialClinico;