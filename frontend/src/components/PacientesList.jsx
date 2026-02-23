import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PacientesList = () => {
    const [pacientes, setPacientes] = useState([]);

    // 1. Definimos la función NORMAL (sin useCallback para simplificar)
    const fetchPacientes = async () => {
        try {
            const response = await axios.get('http://localhost:3000/pacientes');
            setPacientes(response.data);
        } catch (error) {
            console.error("Error al buscar pacientes:", error);
        }
    };

    // 2. useEffect: Se ejecuta al inicio
    useEffect(() => {
        fetchPacientes();
    }, []); // <--- DEJAMOS EL ARRAY VACÍO Y IGNORAMOS LA ADVERTENCIA

    const handleDelete = async (id) => {
        const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar este paciente?");
        if (confirmacion) {
            try {
                await axios.delete(`http://localhost:3000/pacientes/${id}`);
                alert("Paciente eliminado con éxito");
                fetchPacientes(); // Reutilizamos la función aquí
            } catch (error) {
                console.error("Error al eliminar:", error);
                alert("Error al eliminar (Verifica consola)");
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center">Gestión de Pacientes</h2>

            {/* Botón para crear nuevo paciente (Opcional, ya está en el Navbar) */}
            <div className="d-flex justify-content-end mb-3">
                <Link to="/pacientes/nuevo" className="btn btn-success">
                    ➕ Nuevo Paciente
                </Link>
            </div>

            <table className="table table-striped table-hover table-bordered shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>DNI</th>
                        <th>Email</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pacientes.map((paciente) => (
                        <tr key={paciente.id}>
                            <td>{paciente.id}</td>
                            <td>{paciente.nombre}</td>
                            <td>{paciente.apellido}</td>
                            <td>{paciente.dni}</td>
                            <td>{paciente.email}</td>
                            <td>
                                {/* Botón Editar (Amarillo) */}
                                <Link to={`/pacientes/editar/${paciente.id}`} className="btn btn-warning btn-sm me-2">
                                    Editar
                                </Link>

                                {/* Botón Eliminar (Rojo) */}
                                <button 
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(paciente.id)}
                                >
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

export default PacientesList;