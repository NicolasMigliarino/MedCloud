import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './forms.css';

const RolForm = () => {
    const [rol, setRol] = useState({
        nombre: '',
        codigo: ''
    });

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    useEffect(() => {
        if (id) {
            const loadRol = async () => {
                try {
                    const res = await axios.get('http://localhost:3000/roles');
                    const rolEncontrado = res.data.find(r => r.id === parseInt(id));
                    if (rolEncontrado) setRol(rolEncontrado);
                } catch (error) {
                    console.error(error);
                }
            };
            loadRol();
        }
    }, [id]);

    const handleChange = (e) => {
        setRol({ ...rol, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axios.put(`http://localhost:3000/roles/${id}`, rol);
                Swal.fire({ icon: 'success', title: '¡Actualizado!', text: 'Rol actualizado.', timer: 1500, showConfirmButton: false });
            } else {
                await axios.post('http://localhost:3000/roles', rol);
                Swal.fire({ icon: 'success', title: '¡Creado!', text: 'Rol creado correctamente.', timer: 1500, showConfirmButton: false });
            }
            setTimeout(() => navigate('/roles'), 1600);
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Error al guardar el rol.' });
        }
    };

    return (
        <div className="form-page">
            <div className="form-container-layout">
                <div className="form-card-wrapper">
                    <div className="form-card">
                        {/* Header */}
                        <div className="form-card-header purple">
                            <div className="form-header-icon purple">🛡️</div>
                            <div className="form-header-text">
                                <h2>{isEditing ? 'Editar Rol' : 'Crear Nuevo Rol'}</h2>
                                <p>{isEditing ? 'Modificá el nombre o código del rol' : 'Definí un nuevo rol de acceso para el sistema'}</p>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="form-card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-section-label">Datos del Rol</div>

                                <div className="form-group">
                                    <label className="form-label-custom">Nombre del Rol <span className="required">*</span></label>
                                    <input
                                        className="form-input"
                                        type="text"
                                        name="nombre"
                                        value={rol.nombre}
                                        onChange={handleChange}
                                        placeholder="Ej: Administrador"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label-custom">Código Interno <span className="required">*</span></label>
                                    <input
                                        className="form-input"
                                        type="text"
                                        name="codigo"
                                        value={rol.codigo}
                                        onChange={handleChange}
                                        placeholder="Ej: ADMIN"
                                        required
                                    />
                                    <p className="form-hint">🔤 Usado por el sistema para verificar permisos. Se recomienda usar MAYÚSCULAS.</p>
                                </div>

                                {/* Footer */}
                                <div className="form-footer">
                                    <Link to="/roles" className="form-btn-cancel">← Cancelar</Link>
                                    <button type="submit" className="form-btn-submit">
                                        {isEditing ? '💾 Actualizar Rol' : '✅ Crear Rol'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Guía del Asistente */}
                <div className="form-guide-side-card">
                    <h3 style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '1.15rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🛡️ Guía de Roles
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '20px' }}>
                        Creación y configuración de perfiles de seguridad para los accesos:
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="d-flex align-items-start">
                            <span className="guide-step-number" style={{ background: '#7c3aed' }}>1</span>
                            <div>
                                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Nombre Descriptivo</strong>
                                <p className="m-0 mt-1 text-muted" style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                                    Defina el nombre visible legible para humanos (ej: *Administrador de Caja*, *Personal Médico*). Ayuda a identificar el propósito del rol.
                                </p>
                            </div>
                        </div>
                        
                        <div className="d-flex align-items-start">
                            <span className="guide-step-number" style={{ background: '#7c3aed' }}>2</span>
                            <div>
                                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Código Interno</strong>
                                <p className="m-0 mt-1 text-muted" style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                                    El código (ej: `ADMIN`, `MEDICO`) es utilizado por el código fuente para validar permisos. Se recomienda escribirlo en mayúsculas y sin espacios.
                                </p>
                            </div>
                        </div>

                        <div className="p-3 rounded mt-2" style={{ background: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.15)' }}>
                            <strong style={{ color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                                ⚠️ Atención Crítica
                            </strong>
                            <p className="m-0 mt-1 text-muted" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                                Modificar el código de un rol existente puede interrumpir los accesos de los usuarios asociados si este código no coincide exactamente con las validaciones internas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RolForm;