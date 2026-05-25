import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './forms.css';
import './forms-schedule.css'; // Añadimos el nuevo CSS para la grilla

const ProfesionalesForm = () => {
    const [profesional, setProfesional] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        matricula: '',
        especialidad: '',
        telefono: '',
        duracion_turno_promedio: 30,
        porcentaje_honorario: 80,
        tipo_matricula: '',
        cuit_cuil: ''
    });
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;
    // 👇 NUEVO ESTADO: Grilla semanal de horarios
    const [horariosSemana, setHorariosSemana] = useState([
        { dia_semana: 1, activo: false, hora_inicio: '09:00', hora_fin: '18:00', nombre: 'Lunes' },
        { dia_semana: 2, activo: false, hora_inicio: '09:00', hora_fin: '18:00', nombre: 'Martes' },
        { dia_semana: 3, activo: false, hora_inicio: '09:00', hora_fin: '18:00', nombre: 'Miércoles' },
        { dia_semana: 4, activo: false, hora_inicio: '09:00', hora_fin: '18:00', nombre: 'Jueves' },
        { dia_semana: 5, activo: false, hora_inicio: '09:00', hora_fin: '18:00', nombre: 'Viernes' },
        { dia_semana: 6, activo: false, hora_inicio: '09:00', hora_fin: '13:00', nombre: 'Sábado' },
        { dia_semana: 0, activo: false, hora_inicio: '09:00', hora_fin: '13:00', nombre: 'Domingo' }
    ]);

    const handleToggleDia = (index) => {
        const nuevos = [...horariosSemana];
        nuevos[index].activo = !nuevos[index].activo;
        setHorariosSemana(nuevos);
    };

    const handleCambioHora = (index, campo, valor) => {
        const nuevos = [...horariosSemana];
        nuevos[index][campo] = valor;
        setHorariosSemana(nuevos);
    };

    const handleChange = (e) => {
        setProfesional({ ...profesional, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Filtramos solo los días que el usuario activó (activo: true)
        const horariosAEnviar = horariosSemana
            .filter(h => h.activo)
            .map(h => ({
                dia_semana: h.dia_semana,
                hora_inicio: h.hora_inicio,
                hora_fin: h.hora_fin
            }));

        const honorario = parseFloat(profesional.porcentaje_honorario !== undefined ? profesional.porcentaje_honorario : 80);
        const retencion = 100 - honorario;

        const profesionalData = { 
            nombre: profesional.nombre,
            apellido: profesional.apellido,
            dni: profesional.dni,
            matricula: profesional.matricula,
            especialidad: profesional.especialidad,
            telefono: profesional.telefono,
            duracion_turno_promedio: parseInt(profesional.duracion_turno_promedio),
            porcentaje_retencion: retencion,
            tipo_matricula: profesional.tipo_matricula || null,
            cuit_cuil: profesional.cuit_cuil || null,
            horarios: horariosAEnviar.length > 0 ? JSON.stringify(horariosAEnviar) : null
        };

        try {
            if (id) {
                await axios.put(`http://localhost:3000/profesionales/${id}`, profesionalData);
                Swal.fire({ icon: 'success', title: '¡Actualizado!', text: 'Profesional actualizado.', timer: 1500, showConfirmButton: false });
            } else {
                await axios.post('http://localhost:3000/profesionales', profesionalData);
                Swal.fire({ icon: 'success', title: '¡Creado!', text: 'Profesional registrado.', timer: 1500, showConfirmButton: false });
            }
            setTimeout(() => navigate('/profesionales'), 1600);
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar el profesional.' });
        }
    };

    useEffect(() => {
        if (id) {
            const loadProfesional = async () => {
                try {
                    const res = await axios.get(`http://localhost:3000/profesionales/${id}`);
                    const data = res.data;
                    
                    const retencion = data.porcentaje_retencion !== undefined ? parseFloat(data.porcentaje_retencion) : 20;
                    
                    setProfesional({
                        nombre: data.nombre || '',
                        apellido: data.apellido || '',
                        dni: data.dni || data.DNI || '',
                        matricula: data.matricula || '',
                        especialidad: data.especialidad || '',
                        telefono: data.telefono || '',
                        duracion_turno_promedio: data.duracion_turno_promedio !== undefined ? data.duracion_turno_promedio : 30,
                        porcentaje_honorario: 100 - retencion,
                        tipo_matricula: data.tipo_matricula || '',
                        cuit_cuil: data.cuit_cuil || ''
                    });
                } catch (error) {
                    console.error(error);
                }
            };
            loadProfesional();
        }
    }, [id]);

    return (
        <div className="form-page">
            <div className="form-container-layout">
                <div className="form-card-wrapper">
                    <div className="form-card wide">
                        {/* Header */}
                        <div className="form-card-header teal">
                            <div className="form-header-icon teal">🩺</div>
                            <div className="form-header-text">
                                <h2>{isEditing ? 'Editar Profesional' : 'Registrar Profesional'}</h2>
                                <p>{isEditing ? 'Actualizá los datos del profesional' : 'Completá el formulario para agregar un profesional'}</p>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="form-card-body">
                            <form onSubmit={handleSubmit}>
                                {/* Datos personales */}
                                <div className="form-section-label">Datos Personales</div>

                                {/* Fila 1: Nombre y Apellido */}
                                <div className="form-row cols-2">
                                    <div className="form-group">
                                        <label className="form-label-custom">Nombre <span className="required">*</span></label>
                                        <input className="form-input" type="text" name="nombre" value={profesional.nombre} onChange={handleChange} placeholder="Ej: Martín" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label-custom">Apellido <span className="required">*</span></label>
                                        <input className="form-input" type="text" name="apellido" value={profesional.apellido} onChange={handleChange} placeholder="Ej: López" required />
                                    </div>
                                </div>

                                {/* 👇 Fila 2 (NUEVA): DNI y Teléfono 👇 */}
                                <div className="form-row cols-2">
                                    <div className="form-group">
                                        <label className="form-label-custom">DNI <span className="required">*</span></label>
                                        <input className="form-input" type="text" name="dni" value={profesional.dni} onChange={handleChange} placeholder="Ej: 12345678" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label-custom">Teléfono Celular</label>
                                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                            <div className="phone-prefix-addon">
                                                🇦🇷 +54 9
                                            </div>
                                            <input 
                                                className="form-input" 
                                                type="tel" 
                                                name="telefono" 
                                                value={profesional.telefono} 
                                                onChange={handleChange} 
                                                placeholder="11 5678-9012" 
                                                style={{ paddingLeft: '100px' }} 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Datos profesionales */}
                                <div className="form-section-label">Datos Profesionales</div>
                                <div className="form-row cols-2">
                                    <div className="form-group">
                                        <label className="form-label-custom">Matrícula <span className="required">*</span></label>
                                        <input className="form-input" type="text" name="matricula" value={profesional.matricula} onChange={handleChange} placeholder="Ej: MP 98765" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label-custom">Especialidad <span className="required">*</span></label>
                                        <input className="form-input" type="text" name="especialidad" value={profesional.especialidad} onChange={handleChange} placeholder="Ej: Cardiología" required />
                                    </div>
                                </div>
                                <div className="form-row cols-2">
                                    <div className="form-group">
                                        <label className="form-label-custom">Tipo de Matrícula</label>
                                        <div className="form-select-wrap">
                                            <select className="form-select-custom" name="tipo_matricula" value={profesional.tipo_matricula} onChange={handleChange}>
                                                <option value="">Seleccione...</option>
                                                <option value="Nacional">🏛️ Nacional (MN)</option>
                                                <option value="Provincial">🗺️ Provincial (MP)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label-custom">CUIT / CUIL</label>
                                        <input className="form-input" type="text" name="cuit_cuil" value={profesional.cuit_cuil} onChange={handleChange} placeholder="Ej: 20-30123456-7" />
                                    </div>
                                </div>
                                <div className="form-row cols-2">
                                    <div className="form-group">
                                        <label className="form-label-custom">Duración de Turno Promedio (minutos)</label>
                                        <input className="form-input" type="number" name="duracion_turno_promedio" value={profesional.duracion_turno_promedio} onChange={handleChange} min="5" max="120" />
                                        <p className="form-hint">Tiempo estimado por consulta. Por defecto: 30 min.</p>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label-custom">Porcentaje de Honorario del Médico (%)</label>
                                        <input className="form-input" type="number" name="porcentaje_honorario" value={profesional.porcentaje_honorario !== undefined ? profesional.porcentaje_honorario : 80} onChange={handleChange} min="0" max="100" step="1" />
                                        <p className="form-hint">Porcentaje que percibe el médico por consulta. El centro retiene el restante (ej: si el honorario es 80%, la retención es 20%).</p>
                                    </div>
                                </div>

                                {/* 👇 NUEVA SECCIÓN: Días y Horarios Interactivos 👇 */}
                                <div className="form-section-label">Días y Horarios de Atención (Opcional)</div>
                                
                                <div className="schedule-grid">
                                    {horariosSemana.map((dia, index) => (
                                        <div key={dia.dia_semana} className={`schedule-day-row ${dia.activo ? 'active' : ''}`}>
                                            <div className="schedule-day-info">
                                                {/* Toggle iOS Style */}
                                                <label className="modern-toggle">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={dia.activo} 
                                                        onChange={() => handleToggleDia(index)} 
                                                    />
                                                    <span className="modern-toggle-slider"></span>
                                                </label>
                                                <span className="schedule-day-name">{dia.nombre}</span>
                                            </div>
                                            
                                            <div className="schedule-time-inputs">
                                                <input 
                                                    type="time" 
                                                    className="form-input" 
                                                    value={dia.hora_inicio} 
                                                    onChange={(e) => handleCambioHora(index, 'hora_inicio', e.target.value)}
                                                    disabled={!dia.activo}
                                                />
                                                <span className="schedule-time-separator">a</span>
                                                <input 
                                                    type="time" 
                                                    className="form-input" 
                                                    value={dia.hora_fin} 
                                                    onChange={(e) => handleCambioHora(index, 'hora_fin', e.target.value)}
                                                    disabled={!dia.activo}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="form-footer">
                                    <Link to="/profesionales" className="form-btn-cancel">← Cancelar</Link>
                                    <button type="submit" className="form-btn-submit">
                                        {isEditing ? '💾 Actualizar Profesional' : '✅ Guardar Profesional'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Guía del Asistente */}
                <div className="form-guide-side-card">
                    <h3 style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '1.15rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🩺 Guía de Profesional
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '20px' }}>
                        Configuración y alta del personal médico en la institución:
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="d-flex align-items-start">
                            <span className="guide-step-number" style={{ background: '#10b981' }}>1</span>
                            <div>
                                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Identificación y Matrícula</strong>
                                <p className="m-0 mt-1 text-muted" style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                                    Registre la matrícula y seleccione si es Nacional (MN) o Provincial (MP). Esto es crítico para la generación automática de recetas en PDF. Ingrese el CUIT/CUIL para liquidaciones de honorarios y facturación fiscal.
                                </p>
                            </div>
                        </div>
                        
                        <div className="d-flex align-items-start">
                            <span className="guide-step-number" style={{ background: '#10b981' }}>2</span>
                            <div>
                                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Honorarios Médicos</strong>
                                <p className="m-0 mt-1 text-muted" style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                                    Defina el **% de Honorario** que el médico se queda por consulta (ej: 80%). El sistema calculará el **% de retención de la clínica** restando del 100% de manera transparente (ej: retención del 20%).
                                </p>
                            </div>
                        </div>
                        
                        <div className="d-flex align-items-start">
                            <span className="guide-step-number" style={{ background: '#10b981' }}>3</span>
                            <div>
                                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Grilla Horaria</strong>
                                <p className="m-0 mt-1 text-muted" style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                                    Marque los días hábiles del profesional y defina con precisión su rango horario de atención. Esto habilitará de forma automática sus bloques libres en la agenda de turnos.
                                </p>
                            </div>
                        </div>

                        <div className="p-3 rounded mt-2" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                            <strong style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                                💡 Tip de Configuración
                            </strong>
                            <p className="m-0 mt-1 text-muted" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                                Defina una duración promedio realista (ej: 30 minutos). Esto evitará demoras en la sala de espera y optimizará el flujo diario de la clínica.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfesionalesForm;