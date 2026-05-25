import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale/es';
import './forms.css';

registerLocale('es', es);

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
    // 👇 NUEVO ESTADO: Guardamos los horarios de la clínica
    const [horarios, setHorarios] = useState([]);

    const [duracionProfesional, setDuracionProfesional] = useState(30);

    const datePickerRef = useRef(null);

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

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
                // 👇 NUEVO: Ahora también traemos los horarios
                const [resPac, resProf, resHorarios] = await Promise.all([
                    axios.get('http://localhost:3000/pacientes'),
                    axios.get('http://localhost:3000/profesionales'),
                    axios.get('http://localhost:3000/horarios')
                ]);
                setPacientes(resPac.data);
                setProfesionales(resProf.data);
                setHorarios(resHorarios.data);
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

    useEffect(() => {
        if (turno.profesional_id && profesionales.length > 0) {
            const prof = profesionales.find(p => p.id === parseInt(turno.profesional_id));
            if (prof && prof.duracion_turno_promedio) {
                setDuracionProfesional(prof.duracion_turno_promedio);
            }
        }
    }, [turno.profesional_id, profesionales]);

    // 👇 FUNCIÓN DE VALIDACIÓN ESTRICTA DE HORARIOS
    const validarHorarioAtencion = (fechaString, profId) => {
        if (!profId) return { valido: false, mensaje: 'Seleccioná un profesional primero.' };
        
        const fechaObj = new Date(fechaString);
        const ahora = new Date();

        // 👇 NUEVO: Filtro Anti-Pasado
        if (fechaObj < ahora) {
            return { valido: false, mensaje: 'No podés agendar un turno en una fecha u hora que ya pasó.' };
        }

        // Filtramos los horarios solo para el doctor elegido
        const docHorarios = horarios.filter(h => h.profesional_id === parseInt(profId));
        
        // Si el doctor NO tiene horarios cargados en la BD, lo dejamos pasar
        if (docHorarios.length === 0) return { valido: true };

        const diaSemana = fechaObj.getDay(); 
        const horarioDia = docHorarios.find(h => h.dia_semana === diaSemana);
        const nombresDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        if (!horarioDia) {
            const diasQueAtiende = docHorarios.map(h => nombresDias[h.dia_semana]).join(' y ');
            return { valido: false, mensaje: `El profesional no atiende los ${nombresDias[diaSemana]}. Solo atiende: ${diasQueAtiende}.` };
        }

        const horaSeleccionada = `${String(fechaObj.getHours()).padStart(2, '0')}:${String(fechaObj.getMinutes()).padStart(2, '0')}`;

        if (horaSeleccionada < horarioDia.hora_inicio || horaSeleccionada >= horarioDia.hora_fin) {
            return { 
                valido: false, 
                mensaje: `Fuera de horario. Los ${nombresDias[diaSemana]} atiende de ${horarioDia.hora_inicio} a ${horarioDia.hora_fin}.` 
            };
        }

        return { valido: true };
    };

    // Controlador para cerrar el DatePicker
    const handleDateClose = () => {
        if (turno.fecha_hora_inicio && turno.profesional_id) {
            const validacion = validarHorarioAtencion(turno.fecha_hora_inicio, turno.profesional_id);
            if (!validacion.valido) {
                Swal.fire({
                    icon: 'error',
                    title: 'Horario Inválido',
                    text: validacion.mensaje,
                    allowOutsideClick: false,
                    confirmButtonText: 'Corregir Horario'
                }).then((result) => {
                    if (result.isConfirmed) {
                        setTurno((prev) => ({ ...prev, fecha_hora_inicio: '', fecha_hora_fin: '' }));
                    }
                });
            }
        }
        if (datePickerRef.current) {
            datePickerRef.current.setOpen(false);
        }
    };

    // Controlador para la fecha al perder foco (manualmente escrito)
    const handleBlurFechaInicio = (e) => {
        if (!e.relatedTarget?.closest('.react-datepicker')) {
            handleDateClose();
        }
    };

    // Controlador para cambios en el DatePicker
    const handleDateChange = (date) => {
        if (!turno.profesional_id) {
            Swal.fire({ icon: 'warning', title: 'Atención', text: 'Por favor seleccione un Profesional primero.' });
            return;
        }

        if (!date) {
            setTurno((prev) => ({ ...prev, fecha_hora_inicio: '', fecha_hora_fin: '' }));
            return;
        }

        const pad = (n) => String(n).padStart(2, '0');
        const value = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

        const fechaFin = new Date(date.getTime() + duracionProfesional * 60000);
        const valueFin = `${fechaFin.getFullYear()}-${pad(fechaFin.getMonth() + 1)}-${pad(fechaFin.getDate())}T${pad(fechaFin.getHours())}:${pad(fechaFin.getMinutes())}`;

        setTurno((prev) => ({ ...prev, fecha_hora_inicio: value, fecha_hora_fin: valueFin }));
    };

    // 👇 MODIFICADO: handleChange más permisivo, la fecha de inicio se maneja en handleDateChange
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'profesional_id') {
            const selectedProf = profesionales.find(p => p.id === parseInt(value));
            const duracion = selectedProf?.duracion_turno_promedio || 30;
            setDuracionProfesional(duracion);

            if (turno.fecha_hora_inicio) {
                const fechaInicio = new Date(turno.fecha_hora_inicio);
                const fechaFin = new Date(fechaInicio.getTime() + duracion * 60000);
                const pad = (n) => String(n).padStart(2, '0');
                setTurno({ ...turno, profesional_id: value, fecha_hora_fin: `${fechaFin.getFullYear()}-${pad(fechaFin.getMonth() + 1)}-${pad(fechaFin.getDate())}T${pad(fechaFin.getHours())}:${pad(fechaFin.getMinutes())}` });
            } else {
                setTurno({ ...turno, profesional_id: value });
            }
        }
        else {
            setTurno({ ...turno, [name]: value });
        }
    };

    // 👇 MODIFICADO: handleSubmit con validación final antes de guardar (Red de seguridad)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 👇 NUEVO: VALIDACIÓN FINAL ANTES DE GUARDAR
        if (turno.fecha_hora_inicio && turno.profesional_id) {
            const validacion = validarHorarioAtencion(turno.fecha_hora_inicio, turno.profesional_id);
            if (!validacion.valido) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al Guardar',
                    text: validacion.mensaje,
                    confirmButtonText: 'Corregir y Guardar'
                });
                return; // Detener el envío del formulario si la fecha es inválida
            }
        }

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
            const msg = error.response?.data?.message || 'Error al guardar el turno';
            Swal.fire({ icon: 'error', title: 'Error', text: msg });
        }
    };

    return (
        <div className="form-page">
            <div className="form-container-layout">
                <div className="form-card-wrapper">
                    <div className="form-card wide">
                        <div className="form-card-header orange">
                            <div className="form-header-icon orange">📅</div>
                            <div className="form-header-text">
                                <h2>{isEditing ? 'Editar Turno' : 'Agendar Nuevo Turno'}</h2>
                                <p>{isEditing ? 'Modificá los datos del turno' : 'Completá los datos para agendar una nueva cita'}</p>
                            </div>
                        </div>

                        <div className="form-card-body">
                            <form onSubmit={handleSubmit}>
                                {/* Participantes */}
                                <div className="form-section-label">Participantes</div>
                                <div className="form-row cols-2">
                                    <div className="form-group">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <label className="form-label-custom" style={{ margin: 0 }}>Paciente <span className="required">*</span></label>
                                            <Link to="/pacientes/nuevo" target="_blank" rel="noopener noreferrer" style={quickAddStyle}>➕ Nuevo paciente</Link>
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
                                            <Link to="/profesionales/nuevo" target="_blank" rel="noopener noreferrer" style={quickAddStyle}>➕ Nuevo profesional</Link>
                                        </div>
                                        <div className="form-select-wrap">
                                            <select className="form-select-custom" name="profesional_id" value={turno.profesional_id} onChange={handleChange} required>
                                                <option value="">Seleccione un profesional...</option>
                                                {profesionales.map(p => (
                                                    <option key={p.id} value={p.id}>Dr. {p.nombre} {p.apellido} — {p.especialidad}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        {/* Info de horarios del profesional seleccionado */}
                                        {turno.profesional_id && (
                                            <div style={{ 
                                                marginTop: '10px', 
                                                padding: '12px 14px', 
                                                background: 'rgba(26, 115, 232, 0.04)', 
                                                border: '1px solid rgba(26, 115, 232, 0.15)',
                                                borderRadius: '8px',
                                                fontSize: '0.85rem',
                                                color: '#495057'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#1a73e8', fontWeight: '600' }}>
                                                    <span>🕒</span> Días y Horarios de Atención:
                                                </div>
                                                {horarios.filter(h => h.profesional_id === parseInt(turno.profesional_id)).length > 0 ? (
                                                    <ul style={{ margin: 0, paddingLeft: '24px', listStyleType: 'disc' }}>
                                                        {horarios
                                                            .filter(h => h.profesional_id === parseInt(turno.profesional_id))
                                                            .sort((a, b) => a.dia_semana - b.dia_semana)
                                                            .map(h => {
                                                                const nombresDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                                                                const horaInicio = h.hora_inicio ? h.hora_inicio.substring(0, 5) : '';
                                                                const horaFin = h.hora_fin ? h.hora_fin.substring(0, 5) : '';
                                                                return (
                                                                    <li key={h.id} style={{ marginBottom: '4px' }}>
                                                                        <strong>{nombresDias[h.dia_semana]}:</strong> {horaInicio} a {horaFin} hs
                                                                    </li>
                                                                );
                                                            })}
                                                    </ul>
                                                ) : (
                                                    <p style={{ margin: 0, fontStyle: 'italic', color: '#6c757d', paddingLeft: '4px' }}>No hay horarios registrados para este profesional.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Horario */}
                                <div className="form-section-label">Horario</div>
                                <div className="form-row cols-2">
                                    <div className="form-group">
                                        <label className="form-label-custom">Fecha y Hora de Inicio <span className="required">*</span></label>
                                        <div className="datepicker-wrapper" style={{ width: '100%' }}>
                                            <DatePicker
                                                selected={turno.fecha_hora_inicio ? new Date(turno.fecha_hora_inicio) : null}
                                                onChange={handleDateChange}
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                timeCaption="Hora"
                                                dateFormat="dd/MM/yyyy HH:mm"
                                                className="form-input"
                                                placeholderText="Selecciona la fecha y hora..."
                                                locale="es"
                                                ref={datePickerRef}
                                                required
                                                customInput={
                                                    <input
                                                        className="form-input"
                                                        onBlur={handleBlurFechaInicio}
                                                    />
                                                }
                                                shouldCloseOnSelect={false}
                                            >
                                                <div className="datepicker-footer">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDateClose();
                                                        }}
                                                        className="form-btn-submit"
                                                        style={{ width: '100%', padding: '8px', margin: 0 }}
                                                    >
                                                        OK
                                                    </button>
                                                </div>
                                            </DatePicker>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label-custom">Fecha y Hora de Fin</label>
                                        <input className="form-input readonly" type="datetime-local" name="fecha_hora_fin" value={turno.fecha_hora_fin} readOnly />
                                        <p className="form-hint">⚡ Se calcula automáticamente (+{duracionProfesional} min)</p>
                                    </div>
                                </div>

                                {/* Estado y detalles */}
                                <div className="form-section-label">Estado y Detalles</div>
                                <div className="form-group">
                                    <label className="form-label-custom">Estado del Turno</label>
                                    <div className="form-select-wrap">
                                        <select className="form-select-custom" name="estado" value={turno.estado} onChange={handleChange}>
                                            <option value="Pendiente">Pendiente</option>
                                            {/* Lo deshabilitamos para que no lo puedan forzar a mano */}
                                            <option value="Confirmado" disabled>Confirmado (Requiere Pago)</option>
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

                {/* Guía del Asistente */}
                <div className="form-guide-side-card">
                    <h3 style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '1.15rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📅 Guía de Reserva
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '20px' }}>
                        Agendamiento inteligente y control de disponibilidad en la clínica:
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="d-flex align-items-start">
                            <span className="guide-step-number" style={{ background: '#3b82f6' }}>1</span>
                            <div>
                                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Médico y Duración</strong>
                                <p className="m-0 mt-1 text-muted" style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                                    Al seleccionar un médico, el sistema recupera su duración de consulta promedio y sus horarios activos para validar la agenda.
                                </p>
                            </div>
                        </div>
                        
                        <div className="d-flex align-items-start">
                            <span className="guide-step-number" style={{ background: '#3b82f6' }}>2</span>
                            <div>
                                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Asociar Paciente</strong>
                                <p className="m-0 mt-1 text-muted" style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                                    Busque al paciente por nombre o DNI. Si no existe, use el botón de "Nuevo paciente" para darlo de alta en una pestaña secundaria de forma rápida.
                                </p>
                            </div>
                        </div>
                        
                        <div className="d-flex align-items-start">
                            <span className="guide-step-number" style={{ background: '#3b82f6' }}>3</span>
                            <div>
                                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Conflictos y Horarios</strong>
                                <p className="m-0 mt-1 text-muted" style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                                    El sistema no admite turnos en el pasado ni en días/horas fuera del rango del profesional. Confirme el horario en el selector.
                                </p>
                            </div>
                        </div>

                        <div className="p-3 rounded mt-2" style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                            <strong style={{ color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                                ⚡ Cálculo Automático
                            </strong>
                            <p className="m-0 mt-1 text-muted" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                                La hora de finalización se calcula de forma automática sumando los minutos correspondientes al médico elegido al horario de inicio seleccionado.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TurnosForm;