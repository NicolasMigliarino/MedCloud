import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';

// ── Helpers ──────────────────────────────────────────────────────────────────
const getFecha = (s) => new Date(s).toLocaleDateString('es-AR');
const getHora = (s) =>
    new Date(s).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs';

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

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, variant, to }) => {
    const isText = typeof value === 'string' && !/\d/.test(value);
    return (
        <Link to={to} className={`dash-stat-card ${variant}`} style={{ textDecoration: 'none' }}>
            <div className="dash-stat-icon">{icon}</div>
            <div className="dash-stat-label">{label}</div>
            <div className={`dash-stat-value ${isText ? 'text-val' : ''}`}>{value}</div>
            <div className="dash-stat-arrow">→</div>
        </Link>
    );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
    const [stats, setStats] = useState({
        totalPacientes: 0,
        totalProfesionales: 0,
        totalUsuarios: 0,
        citasHoy: 0,
        proximasCitas: []
    });

    const [cajaInfo, setCajaInfo] = useState({
        estado: 'Cargando...',
        monto: 0
    });

    const formatCurrency = (val) => {
        return '$' + parseFloat(val).toLocaleString('es-AR', { minimumFractionDigits: 2 });
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [resPacientes, resProfesionales, resUsuarios, resTurnos, resCaja] = await Promise.all([
                    axios.get('http://localhost:3000/pacientes'),
                    axios.get('http://localhost:3000/profesionales'),
                    axios.get('http://localhost:3000/usuarios'),
                    axios.get('http://localhost:3000/turnos'),
                    axios.get('http://localhost:3000/caja/activa')
                ]);

                const turnos = resTurnos.data;
                const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
                const manana = new Date(hoy); manana.setDate(manana.getDate() + 1);

                const turnosHoy = turnos.filter(t => {
                    const f = new Date(t.fecha_hora_inicio);
                    return f >= hoy && f < manana && t.estado !== 'Cancelado';
                });

                const ahora = new Date();
                const proximas = turnos
                    .filter(t => new Date(t.fecha_hora_inicio) >= ahora && t.estado !== 'Cancelado')
                    .sort((a, b) => new Date(a.fecha_hora_inicio) - new Date(b.fecha_hora_inicio))
                    .slice(0, 5);

                // Calcular monto actual de la caja
                let estadoCaja = 'Cerrada';
                let montoCaja = 0;

                if (resCaja.data && resCaja.data.caja) {
                    estadoCaja = 'Abierta';
                    const caja = resCaja.data.caja;
                    const resumen = resCaja.data.resumen || [];
                    const efectivoRow = resumen.find(r => r.metodo_pago === 'Efectivo');
                    const totalEfectivoCobrado = efectivoRow ? parseFloat(efectivoRow.total) : 0;
                    montoCaja = parseFloat(caja.monto_apertura) + totalEfectivoCobrado;
                }

                setStats({
                    totalPacientes: resPacientes.data.length,
                    totalProfesionales: resProfesionales.data.length,
                    totalUsuarios: resUsuarios.data.length,
                    citasHoy: turnosHoy.length,
                    proximasCitas: proximas,
                });

                setCajaInfo({
                    estado: estadoCaja,
                    monto: montoCaja
                });
            } catch (err) {
                console.error('Error cargando el Dashboard:', err);
                setCajaInfo({
                    estado: 'Error',
                    monto: 0
                });
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div style={{ padding: '4px 0' }}>

            {/* ── Welcome Banner ────────────────────────────────────── */}
            <div className="dash-welcome">
                <div className="dash-welcome-icon">🏥</div>
                <div>
                    <strong>Bienvenido al panel de administración</strong>
                    <p>Utilice las opciones del menú para gestionar el centro médico.</p>
                </div>
            </div>

            {/* ── Stat Cards ────────────────────────────────────────── */}
            <div className="dash-stats-grid">
                <StatCard label="Total Pacientes" value={stats.totalPacientes} icon="👤" variant="blue" to="/pacientes" />
                <StatCard label="Total Profesionales" value={stats.totalProfesionales} icon="🩺" variant="teal" to="/profesionales" />
                <StatCard label="Total Usuarios" value={stats.totalUsuarios} icon="🔑" variant="orange" to="/usuarios" />
                <StatCard label="Citas del Día" value={stats.citasHoy} icon="📅" variant="rose" to="/turnos" />
                <StatCard 
                    label={`Caja Diaria (${cajaInfo.estado})`} 
                    value={cajaInfo.estado === 'Abierta' ? formatCurrency(cajaInfo.monto) : 'Cerrada'} 
                    icon="💵" 
                    variant="purple" 
                    to="/caja" 
                />
                <StatCard 
                    label="Liquidación Médica" 
                    value="Calcular" 
                    icon="🧮" 
                    variant="emerald" 
                    to="/liquidaciones" 
                />
            </div>

            {/* ── Upcoming Appointments ─────────────────────────────── */}
            <div className="dash-section-header">
                <h2 className="dash-section-title">Próximas Citas</h2>
                <Link to="/turnos/nuevo" className="dash-btn-new">
                    <span>➕</span> Nuevo Turno
                </Link>
            </div>

            <div className="dash-table-card">
                <table>
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Profesional</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.proximasCitas.length > 0 ? (
                            stats.proximasCitas.map(turno => (
                                <tr key={turno.id}>
                                    <td>
                                        <div className="dash-name-chip">
                                            <div className="dash-avatar blue-av">
                                                {getInitials(turno.paciente_nombre, turno.paciente_apellido)}
                                            </div>
                                            {turno.paciente_nombre} {turno.paciente_apellido}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="dash-name-chip">
                                            <div className="dash-avatar teal-av">
                                                {getInitials(turno.profesional_nombre, turno.profesional_apellido)}
                                            </div>
                                            Dr. {turno.profesional_nombre} {turno.profesional_apellido}
                                        </div>
                                    </td>
                                    <td>{getFecha(turno.fecha_hora_inicio)}</td>
                                    <td><strong>{getHora(turno.fecha_hora_inicio)}</strong></td>
                                    <td>
                                        <span className={`dash-badge ${getBadgeClass(turno.estado)}`}>
                                            {turno.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="dash-empty-row">
                                <td colSpan="5">
                                    <span className="dash-empty-icon">📋</span>
                                    No hay citas próximas registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;