import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './forms.css';

const UsuariosForm = () => {
    const [usuario, setUsuario] = useState({
        username: '',
        email: '',
        password_hash: '',
        rol_id: '',
        activo: true,
        debe_cambiar_pass: true // Set to true by default for new users
    });

    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await axios.get('http://localhost:3000/roles');
                setRoles(res.data);
            } catch (error) {
                console.error('Error cargando roles:', error);
            }
        };
        fetchRoles();
    }, []);

    useEffect(() => {
        if (id) {
            const fetchUsuario = async () => {
                try {
                    const res = await axios.get(`http://localhost:3000/usuarios/${id}`);
                    setUsuario({
                        username: res.data.username,
                        email: res.data.email,
                        rol_id: res.data.rol_id, // Fix mapping
                        activo: res.data.activo,
                        password_hash: ''
                    });
                } catch (error) {
                    console.error(error);
                }
            };
            fetchUsuario();
        }
    }, [id]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setUsuario({ ...usuario, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:3000/usuarios/${id}`, usuario);
                Swal.fire({ icon: 'success', title: '¡Actualizado!', text: 'Usuario actualizado.', timer: 1500, showConfirmButton: false });
            } else {
                await axios.post('http://localhost:3000/usuarios', usuario);
                Swal.fire({ icon: 'success', title: '¡Creado!', text: 'Usuario creado correctamente.', timer: 1500, showConfirmButton: false });
            }
            setTimeout(() => navigate('/usuarios'), 1600);
        } catch (error) {
            console.error('Error guardando:', error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Error al guardar usuario.' });
        }
    };

    return (
        <div className="form-page">
            <div className="form-card">
                {/* Header */}
                <div className="form-card-header rose">
                    <div className="form-header-icon rose">🔑</div>
                    <div className="form-header-text">
                        <h2>{isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
                        <p>{isEditing ? 'Modificá los datos del usuario' : 'Completá el formulario para crear un usuario'}</p>
                    </div>
                </div>

                {/* Body */}
                <div className="form-card-body">
                    <form onSubmit={handleSubmit}>
                        {/* Credenciales */}
                        <div className="form-section-label">Credenciales</div>
                        <div className="form-group">
                            <label className="form-label-custom">Nombre de Usuario <span className="required">*</span></label>
                            <input className="form-input" type="text" name="username" value={usuario.username} onChange={handleChange} placeholder="Ej: jperez" required autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-label-custom">Email <span className="required">*</span></label>
                            <input className="form-input" type="email" name="email" value={usuario.email} onChange={handleChange} placeholder="correo@email.com" required autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-label-custom">
                                Contraseña {!isEditing && <span className="required">*</span>}
                            </label>
                            <input
                                className="form-input"
                                type="password"
                                name="password_hash"
                                value={usuario.password_hash}
                                onChange={handleChange}
                                required={!isEditing}
                                placeholder={isEditing ? 'Dejar en blanco para mantener la actual' : 'Ingresá una contraseña segura'}
                                autoComplete="new-password"
                            />
                            {isEditing && <p className="form-hint">🔐 Solo completá este campo si querés cambiar la contraseña.</p>}
                        </div>

                        {/* Acceso y permisos */}
                        <div className="form-section-label">Acceso y Permisos</div>
                        <div className="form-group">
                            <label className="form-label-custom">Rol <span className="required">*</span></label>
                            <div className="form-select-wrap">
                                <select className="form-select-custom" name="rol_id" value={usuario.rol_id} onChange={handleChange} required>
                                    <option value="">Seleccione un rol...</option>
                                    {roles.map((rol) => (
                                        <option key={rol.id} value={rol.id}>{rol.nombre} ({rol.codigo})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-toggle-wrap" htmlFor="activoCheck">
                                <input type="checkbox" id="activoCheck" name="activo" checked={usuario.activo} onChange={handleChange} />
                                <span className="form-toggle-label">✅ Usuario Activo — puede ingresar al sistema</span>
                            </label>
                        </div>

                        {/* Footer */}
                        <div className="form-footer">
                            <Link to="/usuarios" className="form-btn-cancel">← Cancelar</Link>
                            <button type="submit" className="form-btn-submit">
                                {isEditing ? '💾 Actualizar Usuario' : '✅ Crear Usuario'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UsuariosForm;