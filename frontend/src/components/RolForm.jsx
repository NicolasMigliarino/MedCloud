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
    );
};

export default RolForm;