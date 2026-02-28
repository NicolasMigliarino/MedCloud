import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './forms.css';

const PacientesForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        obra_social: '',
        numero_afiliado: '',
        fecha_alta: ''
    });

    useEffect(() => {
        const loadPaciente = async () => {
            if (id) {
                try {
                    const response = await axios.get(`http://localhost:3000/pacientes/${id}`);
                    setFormData(response.data);
                } catch (error) {
                    console.error('Error al cargar paciente:', error);
                    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar el paciente para editar.' });
                }
            }
        };
        loadPaciente();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:3000/pacientes/${id}`, formData);
                Swal.fire({ icon: 'success', title: '¡Actualizado!', text: 'Paciente actualizado con éxito.', timer: 1500, showConfirmButton: false });
            } else {
                await axios.post('http://localhost:3000/pacientes', formData);
                Swal.fire({ icon: 'success', title: '¡Registrado!', text: 'Paciente registrado con éxito.', timer: 1500, showConfirmButton: false });
            }
            setTimeout(() => navigate('/pacientes'), 1600);
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Ocurrió un error al guardar.' });
        }
    };

    return (
        <div className="form-page">
            <div className="form-card">
                {/* Header */}
                <div className="form-card-header blue">
                    <div className="form-header-icon blue">👤</div>
                    <div className="form-header-text">
                        <h2>{isEditing ? 'Editar Paciente' : 'Registrar Nuevo Paciente'}</h2>
                        <p>{isEditing ? 'Actualizá los datos del paciente' : 'Completá el formulario para agregar un paciente'}</p>
                    </div>
                </div>

                {/* Body */}
                <div className="form-card-body">
                    <form onSubmit={handleSubmit}>
                        {/* Datos personales */}
                        <div className="form-section-label">Datos Personales</div>
                        <div className="form-row cols-2">
                            <div className="form-group">
                                <label className="form-label-custom">Nombre <span className="required">*</span></label>
                                <input className="form-input" type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: María" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label-custom">Apellido <span className="required">*</span></label>
                                <input className="form-input" type="text" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Ej: González" required />
                            </div>
                        </div>
                        <div className="form-row cols-2">
                            <div className="form-group">
                                <label className="form-label-custom">DNI <span className="required">*</span></label>
                                <input className="form-input" type="text" name="dni" value={formData.dni} onChange={handleChange} placeholder="Ej: 30123456" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label-custom">Fecha de Nacimiento <span className="required">*</span></label>
                                <input className="form-input" type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Contacto */}
                        <div className="form-section-label">Contacto</div>
                        <div className="form-row cols-2">
                            <div className="form-group">
                                <label className="form-label-custom">Email <span className="required">*</span></label>
                                <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="correo@email.com" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label-custom">Teléfono</label>
                                <input className="form-input" type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Ej: +54 9 11 1234-5678" />
                            </div>
                        </div>

                        {/* Obra Social */}
                        <div className="form-section-label">Obra Social</div>
                        <div className="form-row cols-2">
                            <div className="form-group">
                                <label className="form-label-custom">Obra Social</label>
                                <input className="form-input" type="text" name="obra_social" value={formData.obra_social} onChange={handleChange} placeholder="Ej: OSDE" />
                            </div>
                            <div className="form-group">
                                <label className="form-label-custom">N° Afiliado</label>
                                <input className="form-input" type="text" name="numero_afiliado" value={formData.numero_afiliado} onChange={handleChange} placeholder="Ej: 12345678" />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="form-footer">
                            <Link to="/pacientes" className="form-btn-cancel">← Cancelar</Link>
                            <button type="submit" className="form-btn-submit">
                                {isEditing ? '💾 Actualizar Paciente' : '✅ Guardar Paciente'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PacientesForm;