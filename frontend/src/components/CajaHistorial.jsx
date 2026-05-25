import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './modules.css';
import useResizableColumns from './useResizableColumns';

const CajaHistorial = () => {
    const [cajas, setCajas] = useState([]);
    const [loading, setLoading] = useState(true);
    const tableRef = useResizableColumns();

    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const loadHistorial = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:3000/caja/historial', config);
            setCajas(res.data);
        } catch (error) {
            console.error('Error al cargar historial:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo obtener el historial de cierres de caja.'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistorial();
    }, []);

    const formatMoneda = (valor) => {
        if (valor === null || valor === undefined) return '-';
        return `$${parseFloat(valor).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
    };

    const getDiferenciaColor = (diff) => {
        if (diff === null) return 'inherit';
        const num = parseFloat(diff);
        if (num < 0) return '#ef4444'; // Red
        if (num > 0) return '#10b981'; // Green
        return '#6b7280'; // Gray
    };

    return (
        <div className="mod-container">
            <header className="mod-header mb-4">
                <div>
                    <h1 className="mod-title">
                        <span className="mod-title-icon purple">📊</span>
                        Historial de Cierres
                    </h1>
                    <p className="mod-subtitle">Auditoría permanente de balances y cuadres contables de recepción</p>
                </div>
            </header>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : cajas.length === 0 ? (
                <div className="mod-table-card p-5 text-center">
                    <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📭</div>
                    <h3 style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Sin Cierres Registrados</h3>
                    <p className="text-muted">Aún no se ha realizado ningún cierre de caja en el sistema.</p>
                </div>
            ) : (
                <div className="mod-table-card">
                    <table ref={tableRef}>
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th style={{ width: '120px' }}>Fecha</th>
                                <th style={{ width: '130px' }}>Apertura</th>
                                <th style={{ width: '140px' }}>Esperado</th>
                                <th style={{ width: '140px' }}>Real Contado</th>
                                <th style={{ width: '140px' }}>Diferencia</th>
                                <th style={{ width: '120px' }}>Estado</th>
                                <th style={{ width: '220px' }}>Auditoría</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cajas.map((c) => {
                                const diffNum = parseFloat(c.diferencia);
                                let badgeClass = '';
                                let badgeText = '';

                                if (c.estado === 'Abierta') {
                                    badgeClass = 'mod-badge activo';
                                    badgeText = 'Abierta';
                                } else {
                                    badgeClass = 'mod-badge default';
                                    badgeText = 'Cerrada';
                                }

                                return (
                                    <tr key={c.id}>
                                        <td style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                                            #{c.id}
                                        </td>
                                        <td style={{ color: 'var(--text-primary)' }}>
                                            {new Date(c.fecha).toLocaleDateString('es-AR')}
                                        </td>
                                        <td style={{ color: 'var(--text-primary)' }}>
                                            {formatMoneda(c.monto_apertura)}
                                        </td>
                                        <td style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                                            {formatMoneda(c.monto_cierre_esperado)}
                                        </td>
                                        <td style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                                            {formatMoneda(c.monto_cierre_real)}
                                        </td>
                                        <td style={{
                                            fontWeight: 'bold',
                                            color: getDiferenciaColor(c.diferencia)
                                        }}>
                                            {c.estado === 'Abierta' ? '-' : (diffNum >= 0 ? '+' : '') + formatMoneda(c.diferencia)}
                                        </td>
                                        <td>
                                            <span className={badgeClass}>
                                                {badgeText}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                            <div>👤 Abrió: <b>{c.usuario_apertura_nombre}</b></div>
                                            {c.estado === 'Cerrada' && (
                                                <div>🔒 Cerró: <b>{c.usuario_cierre_nombre}</b></div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CajaHistorial;

