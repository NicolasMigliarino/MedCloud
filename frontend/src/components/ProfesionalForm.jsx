import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './forms.css';

const ProfesionalesForm = () => {
    const [profesional, setProfesional] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        matricula: '',
        especialidad: '',
        telefono: '',
        duracion_turno_promedio: 30
    });
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const handleChange = (e) => {
        setProfesional({ ...profesional, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axios.put(`http://localhost:3000/profesionales/${id}`, profesional);
                Swal.fire({ icon: 'success', title: '¡Actualizado!', text: 'Profesional actualizado.', timer: 1500, showConfirmButton: false });
            } else {
                await axios.post('http://localhost:3000/profesionales', profesional);
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
                                <label className="form-label-custom">Teléfono</label>
                                <input className="form-input" type="text" name="telefono" value={profesional.telefono} onChange={handleChange} placeholder="Ej: +54 9 11 5678-9012" />
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