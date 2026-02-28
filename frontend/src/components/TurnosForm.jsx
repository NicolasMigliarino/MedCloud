import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './forms.css';

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
    const isEditing = !!id;

    // Style for the quick-add buttons next to selects
    const quickAddStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.73rem',
        fontWeight: '600',
        color: '#1a73e8',
        background: '#f0f4ff',
        border: '1px solid #c7d9ff',
        borderRadius: '6px',
        padding: '3px 10px',
        textDecoration: 'none',
        transition: 'background 0.15s, color 0.15s',
        whiteSpace: 'nowrap',
    };


    useEffect(() => {
        const fetchDatosDropdown = async () => {
            try {
                const resPacientes = await axios.get('http://localhost:3000/pacientes');
                const resProfesionales = await axios.get('http://localhost:3000/profesionales');
                setPacientes(resPacientes.data);
                setProfesionales(resProfesionales.data);
            } catch (error) {
                console.error('Error cargando datos:', error);
            }
        };
        fetchDatosDropdown();

        if (id) {
            const loadTurno = async () => {
                try {
                    const res = await axios.get('http://localhost:3000/turnos');
                    const turnoEncontrado = res.data.find(t => t.id === parseInt(id));
                    if (turnoEncontrado) {
                        const fmt = (fecha) => fecha ? new Date(fecha).toISOString().slice(0, 16) : '';
                        setTurno({
                            ...turnoEncontrado,
                            fecha_hora_inicio: fmt(turnoEncontrado.fecha_hora_inicio),
                            fecha_hora_fin: fmt(turnoEncontrado.fecha_hora_fin)
                        });
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            loadTurno();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'fecha_hora_inicio' && value) {
            const fechaInicio = new Date(value);
            const fechaFin = new Date(fechaInicio.getTime() + 40 * 60000);
            const pad = (n) => String(n).padStart(2, '0');
            const fechaFinFormateada = `${fechaFin.getFullYear()}-${pad(fechaFin.getMonth() + 1)}-${pad(fechaFin.getDate())}T${pad(fechaFin.getHours())}:${pad(fechaFin.getMinutes())}`;
            setTurno({ ...turno, fecha_hora_inicio: value, fecha_hora_fin: fechaFinFormateada });
        } else {
            setTurno({ ...turno, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axios.put(`http://localhost:3000/turnos/${id}`, turno);
                Swal.fire({ icon: 'success', title: '¡Actualizado!', text: 'El turno fue actualizado.', timer: 1500, showConfirmButton: false });
            } else {
                await axios.post('http://localhost:3000/turnos', turno);
                Swal.fire({ icon: 'success', title: '¡Agendado!', text: 'El turno fue agendado correctamente.', timer: 1500, showConfirmButton: false });
            }
            setTimeout(() => navigate('/turnos'), 1600);
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || 'Error al guardar el turno';
            Swal.fire({ icon: 'error', title: 'Error', text: msg });
        }
    };

    return (
        <div className="form-page">
            <div className="form-card wide">
                {/* Header */}
                <div className="form-card-header orange">
                    <div className="form-header-icon orange">📅</div>
                    <div className="form-header-text">
                        <h2>{isEditing ? 'Editar Turno' : 'Agendar Nuevo Turno'}</h2>
                        <p>{isEditing ? 'Modificá los datos del turno' : 'Completá los datos para agendar una nueva cita'}</p>
                    </div>
                </div>

                {/* Body */}
                <div className="form-card-body">
                    <form onSubmit={handleSubmit}>
                        {/* Participantes */}
                        <div className="form-section-label">Participantes</div>
                        <div className="form-row cols-2">
                            <div className="form-group">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <label className="form-label-custom" style={{ margin: 0 }}>Paciente <span className="required">*</span></label>
                                    <Link
                                        to="/pacientes/nuevo"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={quickAddStyle}
                                        title="Registrar nuevo paciente"
                                    >
                                        ➕ Nuevo paciente
                                    </Link>
                                </div>
                                <div className="form-select-wrap">
                                    <select className="form-select-custom" name="paciente_id" value={turno.paciente_id} onChange={handleChange} required>
                                        <option value="">Seleccione un paciente...</option>
                                        {pacientes.map(p => (
                                            <option key={p.id} value={p.id}>{p.nombre} {p.apellido} — DNI: {p.dni}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <label className="form-label-custom" style={{ margin: 0 }}>Profesional <span className="required">*</span></label>
                                    <Link
                                        to="/profesionales/nuevo"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={quickAddStyle}
                                        title="Registrar nuevo profesional"
                                    >
                                        ➕ Nuevo profesional
                                    </Link>
                                </div>
                                <div className="form-select-wrap">
                                    <select className="form-select-custom" name="profesional_id" value={turno.profesional_id} onChange={handleChange} required>
                                        <option value="">Seleccione un profesional...</option>
                                        {profesionales.map(p => (
                                            <option key={p.id} value={p.id}>Dr. {p.nombre} {p.apellido} — {p.especialidad}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Horario */}
                        <div className="form-section-label">Horario</div>
                        <div className="form-row cols-2">
                            <div className="form-group">
                                <label className="form-label-custom">Fecha y Hora de Inicio <span className="required">*</span></label>
                                <input className="form-input" type="datetime-local" name="fecha_hora_inicio" value={turno.fecha_hora_inicio} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label-custom">Fecha y Hora de Fin</label>
                                <input className="form-input readonly" type="datetime-local" name="fecha_hora_fin" value={turno.fecha_hora_fin} readOnly />
                                <p className="form-hint">⚡ Se calcula automáticamente (+40 min)</p>
                            </div>
                        </div>

                        {/* Estado y detalles */}
                        <div className="form-section-label">Estado y Detalles</div>
                        <div className="form-group">
                            <label className="form-label-custom">Estado del Turno</label>
                            <div className="form-select-wrap">
                                <select className="form-select-custom" name="estado" value={turno.estado} onChange={handleChange}>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Confirmado">Confirmado</option>
                                    <option value="Completado">Completado</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label-custom">Motivo de Consulta</label>
                            <input className="form-input" type="text" name="motivo_consulta" value={turno.motivo_consulta} onChange={handleChange} placeholder="Ej: Control periódico, dolor de cabeza..." />
                        </div>
                        <div className="form-group">
                            <label className="form-label-custom">Observaciones Internas (Admin)</label>
                            <textarea className="form-textarea" name="observaciones_admin" rows="3" value={turno.observaciones_admin} onChange={handleChange} placeholder="Notas internas no visibles al paciente..." />
                        </div>

                        {/* Footer */}
                        <div className="form-footer">
                            <Link to="/turnos" className="form-btn-cancel">← Cancelar</Link>
                            <button type="submit" className="form-btn-submit">
                                {isEditing ? '💾 Actualizar Turno' : '✅ Agendar Turno'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TurnosForm;