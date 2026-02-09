// src/components/UsuariosList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UsuariosList = () => {
    // Aca guardamos la lista de usuarios que nos devuelve el servidor.
    // Inicialmente es un array vacío [] hasta que carguen los datos.
    const [usuarios, setUsuarios] = useState([]);

    //FUNCIÓN PARA CARGAR DATOS
    // Es asíncrona (async) porque debe esperar a que el servidor responda.
    const loadUsuarios = async () => {
        try {
            const res = await axios.get('http://localhost:3000/usuarios');
            setUsuarios(res.data); // Guardamos la respuesta en el estado
        } catch (error) {
            console.error("Error cargando usuarios:", error);
        }
    };

    //FUNCIÓN PARA ELIMINAR
    const handleDelete = async (id) => {
        // Preguntamos antes de borrar para evitar accidentes
        if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
            try {
                await axios.delete(`http://localhost:3000/usuarios/${id}`);
                loadUsuarios(); // Recargamos la lista para que desaparezca el eliminado
            } catch (error) {
                console.error(error);
            }
        }
    };

    // 4. USE EFFECT: Se ejecuta una sola vez cuando el componente se monta en pantalla.
    // Es el equivalente a "Cuando inicie la página, haz esto..."
    useEffect(() => {
        loadUsuarios();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Gestión de Usuarios</h2>
            
            {/* Botón para navegar al formulario de creación */}
            <div className="d-flex justify-content-end mb-3">
                <Link to="/usuarios/nuevo" className="btn btn-primary">➕ Nuevo Usuario</Link>
            </div>

            <table className="table table-striped shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Rol ID</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {/*MAP: Recorremos el array de usuarios y creamos una fila (tr) por cada uno */}
                    {usuarios.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.rolId}</td>
                            <td>
                                {/* Renderizado condicional: Si es true muestra verde, si es false rojo */}
                                {user.activo 
                                    ? <span className="badge bg-success">Activo</span> 
                                    : <span className="badge bg-danger">Inactivo</span>
                                }
                            </td>
                            <td>
                                {/* Navegamos a la ruta de edición pasando el ID en la URL */}
                                <Link to={`/usuarios/editar/${user.id}`} className="btn btn-warning btn-sm me-2">
                                    Editar
                                </Link>
                                <button onClick={() => handleDelete(user.id)} className="btn btn-danger btn-sm">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsuariosList;