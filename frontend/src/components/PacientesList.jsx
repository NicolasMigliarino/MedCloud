import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

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
        // 🌟 NUEVO CARTEL DE CONFIRMACIÓN ANIMADO
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará al paciente de forma permanente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545', // Rojo para el peligro
            cancelButtonColor: '#6c757d',  // Gris para cancelar
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        // Si el usuario presionó "Sí, eliminar"
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:3000/pacientes/${id}`);
                
                // Alerta de éxito pequeña
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'El paciente ha sido borrado del sistema.',
                    timer: 1500,
                    showConfirmButton: false
                });
                
                fetchPacientes(); 
            } catch (error) {
                console.error("Error al eliminar:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar al paciente (Verifica que no tenga turnos ni historial).'
                });
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center">Gestión de Pacientes</h2>

            {/* Botón para crear nuevo paciente */}
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
                                {/* 👇 Botón Historial (Azul) 👇 */}
                                <Link to={`/pacientes/${paciente.id}/historial`} className="btn btn-primary btn-sm me-2">
                                    Historial
                                </Link>

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