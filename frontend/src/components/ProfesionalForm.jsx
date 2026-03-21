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
        DNI: '',
        matricula: '',
        especialidad: '',
        telefono: '',
        duracion_turno_promedio: 30
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

        const profesionalData = { 
            ...profesional, 
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
                    setProfesional(res.data);
                    
                    // Si el backend nos mandara los horarios, podríamos setearlos acá, pero
                    // como el endpoint GET devuelve solo los datos del profesional, 
                    // podemos omitirlo o después traerlos con otro endpoint.
                } catch (error) {
                    console.error(error);
                }
            };
            loadProfesional();
        }
    }, [id]);

    return (
        <div className="form-page">
            <div className="form-card">
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
                                    <div style={{
                                        position: 'absolute',
                                        left: '1px',
                                        background: '#f8fafc',
                                        borderRight: '1.5px solid #e2e8f0',
                                        borderTopLeftRadius: '9px',
                                        borderBottomLeftRadius: '9px',
                                        padding: '0 12px',
                                        height: 'calc(100% - 2px)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#475569',
                                        fontWeight: '600',
                                        fontSize: '0.85rem',
                                        pointerEvents: 'none',
                                        zIndex: 1
                                    }}>
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
                        <div className="form-group">
                            <label className="form-label-custom">Duración de Turno Promedio (minutos)</label>
                            <input className="form-input" type="number" name="duracion_turno_promedio" value={profesional.duracion_turno_promedio} onChange={handleChange} min="5" max="120" />
                            <p className="form-hint">Tiempo estimado por consulta. Por defecto: 30 min.</p>
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
    );
};

export default ProfesionalesForm;