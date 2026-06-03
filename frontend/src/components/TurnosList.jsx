import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import esES from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './modules.css';
import useResizableColumns from './useResizableColumns';
import { getUserRole } from '../utils/auth';

const locales = {
    'es': esES,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const getInitials = (nombre = '', apellido = '') =>
    `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

const getBadgeClass = (estado = '') => {
    const map = {
        confirmado: 'confirmado',
        pendiente: 'pendiente',
        cancelado: 'cancelado',
        completado: 'completado',
    };
    return map[estado?.toLowerCase()] ?? 'default';
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
    const [viewMode, setViewMode] = useState('list'); // 'list' o 'calendar'
    const tableRef = useResizableColumns();
    const navigate = useNavigate();

    const userRole = getUserRole();

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

    // 👇 NUEVA FUNCIÓN: El motor de cobro en recepción
    // 👇 FUNCIÓN DE COBRO (Mejorada visualmente)
    const handleCobrarTurno = async (turno_id) => {
        // 1. Abrimos el popup interactivo sin barras de desplazamiento
        const { value: formValues } = await Swal.fire({
            title: '💰 Registrar Pago',
            html: `
                <div style="padding: 5px 10px; overflow: hidden;">
                    <label style="text-align: left; display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Monto Abonado ($)</label>
                    <input id="swal-input-monto" type="number" class="form-control" placeholder="Ej: 15000" style="margin-bottom: 20px;">
                    
                    <label style="text-align: left; display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Método de Pago</label>
                    <select id="swal-input-metodo" class="form-select">
                        <option value="Efectivo">💵 Efectivo</option>
                        <option value="MercadoPago">📱 MercadoPago / QR</option>
                        <option value="Transferencia">🏦 Transferencia Bancaria</option>
                        <option value="Tarjeta Debito">💳 Tarjeta de Débito</option>
                        <option value="Tarjeta Credito">💳 Tarjeta de Crédito</option>
                        <option value="Obra Social">🏥 Cubierto por Obra Social</option>
                    </select>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: '✅ Confirmar Pago',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#10b981', // Verde moderno
            preConfirm: () => {
                const monto = document.getElementById('swal-input-monto').value;
                const metodo = document.getElementById('swal-input-metodo').value;

                if (!monto || monto <= 0) {
                    Swal.showValidationMessage('Por favor, ingresá un monto válido.');
                    return false;
                }
                return { monto: parseFloat(monto), metodo_pago: metodo };
            }
        });

        // 2. Si la secretaria le dio a "Confirmar", enviamos todo al Backend
        if (formValues) {
            try {
                await axios.post(`http://localhost:3000/turnos/${turno_id}/pagar`, formValues);

                Swal.fire({
                    icon: 'success',
                    title: '¡Pago Registrado!',
                    text: 'El turno pasó a estado Confirmado automáticamente.',
                    timer: 2000,
                    showConfirmButton: false
                });

                // 3. Recargamos la lista
                loadTurnos();

            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo registrar el pago.', 'error');
            }
        }
    };

    useEffect(() => { loadTurnos(); }, []);

    const filtered = useMemo(() => {
        return turnos.filter(t =>
            `${t.paciente_nombre} ${t.paciente_apellido} ${t.profesional_nombre} ${t.profesional_apellido} ${t.estado}`.toLowerCase().includes(search.toLowerCase())
        );
    }, [turnos, search]);

    // Mapeo de turnos para react-big-calendar
    const eventosCalendario = useMemo(() => {
        return turnos.map(t => ({
            id: t.id,
            title: `${t.paciente_nombre} ${t.paciente_apellido} (${t.estado})`,
            start: new Date(t.fecha_hora_inicio),
            end: new Date(t.fecha_hora_fin),
            resource: t
        }));
    }, [turnos]);

    // Personalizar el aspecto y color de los eventos en el calendario
    const eventPropGetter = (event) => {
        let bgColor = '#e5e7eb'; // Default gray
        let color = '#374151';

        const estado = event.resource?.estado?.toLowerCase();

        switch (estado) {
            case 'confirmado':
                bgColor = '#dbeafe'; color = '#1d4ed8'; break;
            case 'pendiente':
                bgColor = '#fef3c7'; color = '#92400e'; break;
            case 'completado':
                bgColor = '#d1fae5'; color = '#065f46'; break;
            case 'cancelado':
                bgColor = '#fee2e2'; color = '#b91c1c'; break;
            default: break;
        }

        return {
            style: {
                backgroundColor: bgColor,
                color: color,
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '0.8rem',
                padding: '2px 6px'
            }
        };
    };

    const handleSelectEvent = (event) => {
        navigate(`/turnos/editar/${event.id}`);
    };

    const handleSelectSlot = ({ start }) => {
        if (userRole?.toUpperCase() !== 'MEDICO') {
            navigate('/turnos/nuevo', { state: { selectedDate: start } });
        }
    };
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
                    {userRole?.toUpperCase() !== 'MEDICO' && (
                        <Link to="/turnos/nuevo" className="mod-btn-add">➕ Agendar Turno</Link>
                    )}
                </div>
            </div>

            {/* Toggle Vista Lista / Calendario */}
            <div className="view-toggle" style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                <button
                    onClick={() => setViewMode('list')}
                    className={`mod-btn ${viewMode === 'list' ? 'active' : ''}`}
                    style={{ padding: '8px 16px', background: viewMode === 'list' ? '#1a73e8' : '#fff', color: viewMode === 'list' ? '#fff' : '#6b7280', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                    📋 Lista
                </button>
                <button
                    onClick={() => setViewMode('calendar')}
                    className={`mod-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                    style={{ padding: '8px 16px', background: viewMode === 'calendar' ? '#1a73e8' : '#fff', color: viewMode === 'calendar' ? '#fff' : '#6b7280', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                    🗓️ Calendario
                </button>
            </div>

            {viewMode === 'list' ? (
                <>
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
                                            {/* 👇 SECCIÓN DE ACCIONES ACTUALIZADA 👇 */}
                                            <div className="mod-actions" style={{ display: 'flex', gap: '5px' }}>
                                                {/* Botón de Cobrar: Solo aparece si está pendiente y el rol no es PROFESIONAL */}
                                                {turno.estado?.toLowerCase() === 'pendiente' && userRole?.toUpperCase() !== 'MEDICO' && (
                                                    <button
                                                        onClick={() => handleCobrarTurno(turno.id)}
                                                        className="mod-btn"
                                                        style={{ backgroundColor: '#10b981', color: 'white', borderColor: '#10b981' }}
                                                        title="Registrar Pago y Confirmar"
                                                    >
                                                        💰 Cobrar
                                                    </button>
                                                )}
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
                                        <td colSpan="5">
                                            <span className="mod-empty-icon">📅</span>
                                            <p>No se encontraron turnos.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                /* Vista de Calendario */
                <div className="mod-table-card mod-calendar-wrapper" style={{ padding: '24px', height: '650px', background: '#fff' }}>
                    <Calendar
                        localizer={localizer}
                        events={eventosCalendario}
                        startAccessor="start"
                        endAccessor="end"
                        culture="es"
                        messages={{
                            next: "Siguiente",
                            previous: "Anterior",
                            today: "Hoy",
                            month: "Mes",
                            week: "Semana",
                            day: "Día",
                            agenda: "Agenda",
                            date: "Fecha",
                            time: "Hora",
                            event: "Turno",
                            noEventsInRange: "No hay turnos agendados en este periodo."
                        }}
                        eventPropGetter={eventPropGetter}
                        onSelectEvent={handleSelectEvent}
                        onSelectSlot={handleSelectSlot}
                        selectable
                        popup
                    />
                </div>
            )}
        </div>
    );
};

export default TurnosList;