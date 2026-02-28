import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './modules.css';
import useResizableColumns from './useResizableColumns';

const getInitials = (nombre = '', apellido = '') =>
    `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

const getBadgeClass = (estado = '') => {
    const map = {
        confirmado: 'confirmado',
        pendiente: 'pendiente',
        cancelado: 'cancelado',
        completado: 'completado',
    };
    return map[estado.toLowerCase()] ?? 'default';
};

const formatearHorario = (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) return '';
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const fechaStr = inicio.toLocaleDateString('es-AR');
    const opts = { hour: '2-digit', minute: '2-digit' };
    return `${fechaStr} | ${inicio.toLocaleTimeString('es-AR', opts)} – ${fin.toLocaleTimeString('es-AR', opts)}`;
};

const TurnosList = () => {
    const [turnos, setTurnos] = useState([]);
    const [search, setSearch] = useState('');
    const tableRef = useResizableColumns();

    const loadTurnos = async () => {
        try {
            const res = await axios.get('http://localhost:3000/turnos');
            setTurnos(res.data);
        } catch (error) {
            console.error('Error cargando turnos:', error);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción cancelará y eliminará el turno de forma permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:3000/turnos/${id}`);
                Swal.fire({ icon: 'success', title: 'Eliminado', text: 'El turno ha sido eliminado.', timer: 1500, showConfirmButton: false });
                loadTurnos();
            } catch (error) {
                console.error(error);
                Swal.fire({ icon: 'error', title: 'Error', text: 'Error al eliminar el turno.' });
            }
        }
    };

    useEffect(() => { loadTurnos(); }, []);

    const filtered = turnos.filter(t =>
        `${t.paciente_nombre} ${t.paciente_apellido} ${t.profesional_nombre} ${t.profesional_apellido} ${t.estado}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding: '4px 0' }}>
            {/* Header */}
            <div className="mod-header">
                <h1 className="mod-title">
                    <span className="mod-title-icon orange">📅</span>
                    Gestión de Turnos
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="mod-count-chip">📅 {turnos.length} turnos</span>
                    <Link to="/turnos/nuevo" className="mod-btn-add">➕ Agendar Turno</Link>
                </div>
            </div>

            {/* Search */}
            <div className="mod-search-wrap">
                <span className="mod-search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Buscar por paciente, profesional o estado..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="mod-table-card">
                <table ref={tableRef}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Paciente</th>
                            <th>Profesional</th>
                            <th>Fecha y Horario</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map((turno) => (
                            <tr key={turno.id}>
                                <td><span className="mod-id">#{turno.id}</span></td>
                                <td>
                                    <div className="mod-name-chip">
                                        <div className="mod-avatar blue">{getInitials(turno.paciente_nombre, turno.paciente_apellido)}</div>
                                        <span>{turno.paciente_nombre} {turno.paciente_apellido}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="mod-name-chip">
                                        <div className="mod-avatar teal">{getInitials(turno.profesional_nombre, turno.profesional_apellido)}</div>
                                        <span>Dr. {turno.profesional_nombre} {turno.profesional_apellido}</span>
                                    </div>
                                </td>
                                <td style={{ fontSize: '0.83rem' }}>
                                    {formatearHorario(turno.fecha_hora_inicio, turno.fecha_hora_fin)}
                                </td>
                                <td>
                                    <span className={`mod-badge ${getBadgeClass(turno.estado)}`}>
                                        {turno.estado || 'Pendiente'}
                                    </span>
                                </td>
                                <td>
                                    <div className="mod-actions">
                                        <Link to={`/turnos/editar/${turno.id}`} className="mod-btn edit">
                                            ✏️ Editar
                                        </Link>
                                        <button className="mod-btn delete" onClick={() => handleDelete(turno.id)}>
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr className="mod-empty">
                                <td colSpan="6">
                                    <span className="mod-empty-icon">📅</span>
                                    <p>No se encontraron turnos.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TurnosList;