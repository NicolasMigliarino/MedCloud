import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TurnosList = () => {
    const [turnos, setTurnos] = useState([]);

    const loadTurnos = async () => {
        try {
            const res = await axios.get('http://localhost:3000/turnos');
            setTurnos(res.data);
        } catch (error) {
            console.error("Error cargando turnos:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que quieres cancelar y eliminar este turno?")) {
            try {
                await axios.delete(`http://localhost:3000/turnos/${id}`);
                loadTurnos();
            } catch (error) {
                console.error(error);
                alert("Error al eliminar el turno.");
            }
        }
    };

    useEffect(() => {
        loadTurnos();
    }, []);

    // 👇 Función auxiliar para formatear la fecha y los horarios combinados
    const formatearHorario = (fechaInicio, fechaFin) => {
        if (!fechaInicio || !fechaFin) return '';
        
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        // Obtenemos la fecha (ej: 21/02/2026)
        const fechaStr = inicio.toLocaleDateString('es-AR');
        
        // Obtenemos solo la hora y minutos (ej: 22:00)
        const opcionesHora = { hour: '2-digit', minute: '2-digit' };
        const horaInicioStr = inicio.toLocaleTimeString('es-AR', opcionesHora);
        const horaFinStr = fin.toLocaleTimeString('es-AR', opcionesHora);

        return `${fechaStr} | ${horaInicioStr} a ${horaFinStr}`;
    };

    return (
        <div className="container mt-4">
            <h2>Gestión de Turnos</h2>
            <div className="d-flex justify-content-end mb-3">
                <Link to="/turnos/nuevo" className="btn btn-primary">➕ Agendar Turno</Link>
            </div>
            <table className="table table-striped shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Paciente</th>
                        <th>Profesional</th>
                        <th>Fecha y Horario</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {turnos.map((turno) => (
                        <tr key={turno.id}>
                            <td>{turno.id}</td>
                            
                            {/* Ahora usamos los nombres que vienen del JOIN de SQL */}
                            <td>{turno.paciente_nombre} {turno.paciente_apellido}</td>
                            <td>{turno.profesional_nombre} {turno.profesional_apellido}</td>
                            
                            {/* Usamos nuestra nueva función para el horario */}
                            <td>{formatearHorario(turno.fecha_hora_inicio, turno.fecha_hora_fin)}</td>
                            
                            <td>
                                <span className={`badge ${
                                    turno.estado === 'Pendiente' ? 'bg-warning' : 
                                    turno.estado === 'Completado' ? 'bg-success' : 
                                    turno.estado === 'Confirmado' ? 'bg-primary' :
                                    'bg-secondary'
                                }`}>
                                    {turno.estado || 'Pendiente'}
                                </span>
                            </td>
                            <td>
                                <Link to={`/turnos/editar/${turno.id}`} className="btn btn-warning btn-sm me-2">Editar</Link>
                                <button onClick={() => handleDelete(turno.id)} className="btn btn-danger btn-sm">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TurnosList;