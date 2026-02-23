import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalPacientes: 0,
        totalProfesionales: 0,
        totalUsuarios: 0,
        citasHoy: 0,
        proximasCitas: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Hacemos las 4 peticiones al mismo tiempo para que sea súper rápido
                const [resPacientes, resProfesionales, resUsuarios, resTurnos] = await Promise.all([
                    axios.get('http://localhost:3000/pacientes'),
                    axios.get('http://localhost:3000/profesionales'),
                    axios.get('http://localhost:3000/usuarios'),
                    axios.get('http://localhost:3000/turnos')
                ]);

                const turnos = resTurnos.data;
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0); // Inicio del día de hoy
                
                const manana = new Date(hoy);
                manana.setDate(manana.getDate() + 1); // Inicio de mañana

                // Filtramos turnos de hoy
                const turnosHoy = turnos.filter(t => {
                    const fechaTurno = new Date(t.fecha_hora_inicio);
                    return fechaTurno >= hoy && fechaTurno < manana && t.estado !== 'Cancelado';
                });

                // Filtramos las próximas citas (desde ahora en adelante) y tomamos las primeras 5
                const ahora = new Date();
                const proximas = turnos
                    .filter(t => new Date(t.fecha_hora_inicio) >= ahora && t.estado !== 'Cancelado')
                    .sort((a, b) => new Date(a.fecha_hora_inicio) - new Date(b.fecha_hora_inicio))
                    .slice(0, 5);

                setStats({
                    totalPacientes: resPacientes.data.length,
                    totalProfesionales: resProfesionales.data.length,
                    totalUsuarios: resUsuarios.data.length,
                    citasHoy: turnosHoy.length,
                    proximasCitas: proximas
                });

            } catch (error) {
                console.error("Error cargando el Dashboard:", error);
            }
        };

        fetchDashboardData();
    }, []);

    // Funciones auxiliares para la tabla
    const getFecha = (fechaString) => new Date(fechaString).toLocaleDateString('es-AR');
    const getHora = (fechaString) => new Date(fechaString).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs';

    return (
        <div className="container mt-4">
            {/* Alerta de Bienvenida */}
            <div className="alert alert-primary d-flex align-items-center mb-4" role="alert">
                <span>ℹ️ Bienvenido al panel de administración. Utilice las opciones del menú para gestionar el centro médico.</span>
            </div>

            {/* Tarjetas de Estadísticas (Imitando los colores de tu imagen) */}
            <div className="row mb-5">
                <div className="col-md-3">
                    <div className="card shadow-sm border-0" style={{ backgroundColor: '#d0e1fd', color: '#0a58ca' }}>
                        <div className="card-body">
                            <h6 className="card-title text-muted mb-1">➕ Total Pacientes</h6>
                            <h2 className="display-5 fw-bold mb-0">{stats.totalPacientes}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card shadow-sm border-0" style={{ backgroundColor: '#d1f0eb', color: '#0f5132' }}>
                        <div className="card-body">
                            <h6 className="card-title text-muted mb-1">🩺 Total Profesionales</h6>
                            <h2 className="display-5 fw-bold mb-0">{stats.totalProfesionales}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card shadow-sm border-0" style={{ backgroundColor: '#ffe5d0', color: '#9e4a04' }}>
                        <div className="card-body">
                            <h6 className="card-title text-muted mb-1">👤 Total Usuarios</h6>
                            <h2 className="display-5 fw-bold mb-0">{stats.totalUsuarios}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card shadow-sm border-0" style={{ backgroundColor: '#f8d7da', color: '#842029' }}>
                        <div className="card-body">
                            <h6 className="card-title text-muted mb-1">📅 Citas del Día</h6>
                            <h2 className="display-5 fw-bold mb-0">{stats.citasHoy}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de Próximas Citas */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold">Próximas Citas</h4>
                <Link to="/turnos/nuevo" className="btn btn-primary">Nuevo Turno ➕</Link>
            </div>
            
            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="border-0">Paciente</th>
                                <th className="border-0">Profesional</th>
                                <th className="border-0">Fecha</th>
                                <th className="border-0">Hora</th>
                                <th className="border-0">Estado</th>
                                <th className="border-0">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.proximasCitas.length > 0 ? (
                                stats.proximasCitas.map(turno => (
                                    <tr key={turno.id}>
                                        <td className="align-middle">{turno.paciente_nombre} {turno.paciente_apellido}</td>
                                        <td className="align-middle">Dr. {turno.profesional_nombre} {turno.profesional_apellido}</td>
                                        <td className="align-middle">{getFecha(turno.fecha_hora_inicio)}</td>
                                        <td className="align-middle">{getHora(turno.fecha_hora_inicio)}</td>
                                        <td className="align-middle">
                                            <span className="badge bg-primary">{turno.estado}</span>
                                        </td>
                                        <td className="align-middle">
                                            <Link to={`/turnos/editar/${turno.id}`} className="btn btn-warning btn-sm me-2 text-white">Ver</Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">No hay citas próximas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;