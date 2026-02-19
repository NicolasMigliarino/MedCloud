import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RolList = () => {
    const [roles, setRoles] = useState([]);

    const loadRoles = async () => {
        try {
            const res = await axios.get('http://localhost:3000/roles');
            setRoles(res.data);
        } catch (error) {
            console.error("Error cargando roles:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que quieres eliminar este rol?")) {
            try {
                await axios.delete(`http://localhost:3000/roles/${id}`);
                loadRoles(); // Recargamos la lista
            } catch (error) {
                console.error(error);
                alert("Error al eliminar. Puede que el rol esté asignado a un usuario.");
            }
        }
    };

    useEffect(() => {
        loadRoles();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Gestión de Roles</h2>
            <div className="d-flex justify-content-end mb-3">
                <Link to="/roles/nuevo" className="btn btn-primary">➕ Nuevo Rol</Link>
            </div>
            <table className="table table-bordered shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Código (Interno)</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((rol) => (
                        <tr key={rol.id}>
                            <td>{rol.id}</td>
                            <td>{rol.nombre}</td>
                            <td><code>{rol.codigo}</code></td>
                            <td>
                                <Link to={`/roles/editar/${rol.id}`} className="btn btn-warning btn-sm me-2">
                                    Editar
                                </Link>
                                <button onClick={() => handleDelete(rol.id)} className="btn btn-danger btn-sm">
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

export default RolList;