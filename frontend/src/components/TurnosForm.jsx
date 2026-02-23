import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const TurnosForm = () => {
    const [turno, setTurno] = useState({
        profesional_id: '',
        paciente_id: '',
        fecha_hora_inicio: '',
        fecha_hora_fin: '',
        estado: 'Pendiente',
        motivo_consulta: '',
        observaciones_admin: ''
    });

    const [pacientes, setPacientes] = useState([]);
    const [profesionales, setProfesionales] = useState([]);
    
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchDatosDropdown = async () => {
            try {
                const resPacientes = await axios.get('http://localhost:3000/pacientes');
                const resProfesionales = await axios.get('http://localhost:3000/profesionales');
                setPacientes(resPacientes.data);
                setProfesionales(resProfesionales.data);
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        fetchDatosDropdown();

        if (id) {
            const loadTurno = async () => {
                try {
                   const res = await axios.get('http://localhost:3000/turnos');
                   const turnoEncontrado = res.data.find(t => t.id === parseInt(id));
                   if(turnoEncontrado) {
                       const formatearParaInput = (fecha) => fecha ? new Date(fecha).toISOString().slice(0, 16) : '';
                       setTurno({
                           ...turnoEncontrado,
                           fecha_hora_inicio: formatearParaInput(turnoEncontrado.fecha_hora_inicio),
                           fecha_hora_fin: formatearParaInput(turnoEncontrado.fecha_hora_fin)
                       });
                   }
                } catch (error) {
                    console.error(error);
                }
            };
            loadTurno();
        }
    }, [id]);

    // 👇 AQUÍ ESTÁ LA MAGIA DEL CÁLCULO DE 40 MINUTOS 👇
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'fecha_hora_inicio' && value) {
            // 1. Convertimos el valor seleccionado a una fecha de Javascript
            const fechaInicio = new Date(value);
            
            // 2. Le sumamos 40 minutos
            const fechaFin = new Date(fechaInicio.getTime() + 40 * 60000); // 60000 ms = 1 minuto

            // 3. Formateamos la nueva fecha al formato YYYY-MM-DDTHH:mm para el input
            const anio = fechaFin.getFullYear();
            const mes = String(fechaFin.getMonth() + 1).padStart(2, '0');
            const dia = String(fechaFin.getDate()).padStart(2, '0');
            const horas = String(fechaFin.getHours()).padStart(2, '0');
            const minutos = String(fechaFin.getMinutes()).padStart(2, '0');
            
            const fechaFinFormateada = `${anio}-${mes}-${dia}T${horas}:${minutos}`;

            // 4. Guardamos AMBAS fechas a la vez
            setTurno({ 
                ...turno, 
                fecha_hora_inicio: value, 
                fecha_hora_fin: fechaFinFormateada 
            });
        } else {
            // Para el resto de los campos, se comporta normal
            setTurno({ ...turno, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axios.put(`http://localhost:3000/turnos/${id}`, turno);
                alert('Turno actualizado');
            } else {
                await axios.post('http://localhost:3000/turnos', turno);
                alert('Turno agendado');
            }
            navigate('/turnos');
        } catch (error) {
            console.error(error);
            // Mostramos el error exacto que viene de SQL (si lo hay)
            const mensajeError = error.response?.data?.message || "Error al guardar el turno";
            alert(`❌ ${mensajeError}`);
        }
    };

    return (
        <div className="card mx-auto mt-4 mb-5" style={{ maxWidth: '600px' }}>
            <div className="card-header bg-dark text-white">
                <h4>{id ? 'Editar Turno' : 'Agendar Nuevo Turno'}</h4>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Paciente</label>
                            <select className="form-select" name="paciente_id" value={turno.paciente_id} onChange={handleChange} required>
                                <option value="">Seleccione un paciente...</option>
                                {pacientes.map(p => (
                                    <option key={p.id} value={p.id}>{p.nombre} {p.apellido} (DNI: {p.dni})</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Profesional</label>
                            <select className="form-select" name="profesional_id" value={turno.profesional_id} onChange={handleChange} required>
                                <option value="">Seleccione un profesional...</option>
                                {profesionales.map(p => (
                                    <option key={p.id} value={p.id}>{p.nombre} {p.apellido} ({p.especialidad})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Fecha y Hora de Inicio</label>
                            <input 
                                type="datetime-local" 
                                className="form-control" 
                                name="fecha_hora_inicio" 
                                value={turno.fecha_hora_inicio} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Fecha y Hora de Fin (Automático)</label>
                            <input 
                                type="datetime-local" 
                                className="form-control bg-light" 
                                name="fecha_hora_fin" 
                                value={turno.fecha_hora_fin} 
                                readOnly /* 👇 IMPORTANTE: El usuario ya no puede editar esto manualmente */
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Estado</label>
                        <select className="form-select" name="estado" value={turno.estado} onChange={handleChange}>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Confirmado">Confirmado</option>
                            <option value="Completado">Completado</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Motivo de Consulta (Opcional)</label>
                        <input type="text" className="form-control" name="motivo_consulta" value={turno.motivo_consulta} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Observaciones Internas (Admin)</label>
                        <textarea className="form-control" name="observaciones_admin" rows="2" value={turno.observaciones_admin} onChange={handleChange}></textarea>
                    </div>

                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">Guardar Turno</button>
                        <Link to="/turnos" className="btn btn-secondary">Cancelar</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TurnosForm;