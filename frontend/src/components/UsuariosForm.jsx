// src/components/UsuariosForm.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UsuariosForm = () => {
    // ESTADO DEL FORMULARIO:
    // Aca guardamos lo que el usuario escribe. Los nombres coinciden con lo que espera el Backend.
    const [usuario, setUsuario] = useState({
        username: '',
        email: '',
        password_hash: '', 
        rol_id: '',
        activo: true, // Por defecto, al crear, el usuario está activo
        debe_cambiar_pass: false
    });
    
    // Estado para guardar la lista de roles que traemos de la base de datos
    const [roles, setRoles] = useState([]);
    
    // Hooks de navegación y parámetros de URL
    const navigate = useNavigate(); // Para redirigir al terminar
    const { id } = useParams();     // Para capturar el ID si estamos editando
    const isEditing = !!id;         // Variable booleana: true si hay ID, false si no

    // CARGAR ROLES (Se ejecuta al iniciar)
    // Necesitamos esto para llenar el <select> del formulario
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await axios.get('http://localhost:3000/roles');
                setRoles(res.data);
            } catch (error) {
                console.error("Error cargando roles:", error);
            }
        };
        fetchRoles();
    }, []);

    //CARGAR USUARIO (Solo si estamos editando)
    useEffect(() => {
        if (id) {
            const fetchUsuario = async () => {
                try {
                    const res = await axios.get(`http://localhost:3000/usuarios/${id}`);
                    // Rellenamos el formulario con los datos que vienen de la BD
                    setUsuario({
                        username: res.data.username,
                        email: res.data.email,
                        rol_id: res.data.rolId, 
                        activo: res.data.activo,
                        password_hash: '' // Dejamos la contraseña vacía por seguridad (solo se llena si la quieren cambiar)
                    });
                } catch (error) {
                    console.error(error);
                }
            };
            fetchUsuario();
        }
    }, [id]); // Este efecto se dispara si cambia el ID

    // 4. MANEJADOR DE CAMBIOS (HandleChange)
    // Se ejecuta cada vez que el usuario escribe en un input o cambia el checkbox
    const handleChange = (e) => {
        // Si es un checkbox, usamos 'checked', si es texto usamos 'value'
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        
        // Copiamos el estado anterior (...usuario) y sobreescribimos solo el campo que cambió
        setUsuario({ ...usuario, [e.target.name]: value });
    };

    // 5. ENVIAR FORMULARIO (Submit)
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue sola
        try {
            if (isEditing) {
                // Si editamos, usamos PUT y la URL con ID
                await axios.put(`http://localhost:3000/usuarios/${id}`, usuario);
                alert('Usuario actualizado');
            } else {
                // Si creamos, usamos POST y la URL base
                await axios.post('http://localhost:3000/usuarios', usuario);
                alert('Usuario creado');
            }
            navigate('/usuarios'); // Volvemos a la lista
        } catch (error) {
            console.error("Error guardando:", error);
            alert("Error al guardar usuario");
        }
    };

    return (
        <div className="card mx-auto mt-4" style={{ maxWidth: '600px' }}>
            <div className="card-header bg-dark text-white">
                <h4>{isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h4>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    
                    {/* Input: Username */}
                    <div className="mb-3">
                        <label className="form-label">Nombre de Usuario</label>
                        <input type="text" name="username" className="form-control" 
                               value={usuario.username} onChange={handleChange} required />
                    </div>

                    {/* Input: Email */}
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="form-control" 
                               value={usuario.email} onChange={handleChange} required />
                    </div>

                    {/* Input: Password */}
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input type="password" name="password_hash" className="form-control" 
                               value={usuario.password_hash} onChange={handleChange} 
                               required={!isEditing} // Solo obligatoria si es nuevo usuario
                               placeholder={isEditing ? "Dejar en blanco para mantener la actual" : ""}
                               />
                    </div>

                    {/* Select: Roles (Dinámico desde BD) */}
                    <div className="mb-3">
                        <label className="form-label">Rol</label>
                        <select name="rol_id" className="form-select" 
                                value={usuario.rol_id} onChange={handleChange} required>
                            <option value="">Seleccione un rol...</option>
                            {/* Mapeamos el array de roles para crear las opciones */}
                            {roles.map((rol) => (
                                <option key={rol.id} value={rol.id}>
                                    {rol.nombre} ({rol.codigo})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Checkbox: Activo */}
                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="activoCheck"
                               name="activo" checked={usuario.activo} onChange={handleChange} />
                        <label className="form-check-label" htmlFor="activoCheck">Usuario Activo</label>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UsuariosForm;