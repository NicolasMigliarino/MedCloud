import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './modules.css';
import useResizableColumns from './useResizableColumns';
import { hasRole } from '../utils/auth';

const getInitials = (nombre = '', apellido = '') =>
    `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

const PacientesList = () => {
    const [pacientes, setPacientes] = useState([]);
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const tableRef = useResizableColumns();

    const esMedico = hasRole('MEDICO');

    const fetchPacientes = async () => {
        try {
            const response = await axios.get('http://localhost:3000/pacientes');
            setPacientes(response.data);
        } catch (error) {
            console.error('Error al buscar pacientes:', error);
        }
    };

    useEffect(() => { fetchPacientes(); }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará al paciente de forma permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:3000/pacientes/${id}`);
                Swal.fire({ icon: 'success', title: 'Eliminado', text: 'El paciente ha sido borrado del sistema.', timer: 1500, showConfirmButton: false });
                fetchPacientes();
            } catch (error) {
                console.error('Error al eliminar:', error);
                Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar al paciente (Verifica que no tenga turnos ni historial).' });
            }
        }
    };

    // Reset to page 1 on search change
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const filtered = useMemo(() => {
        return pacientes.filter(p =>
            `${p.nombre} ${p.apellido} ${p.dni} ${p.email}`.toLowerCase().includes(search.toLowerCase())
        );
    }, [pacientes, search]);

    const sortedData = useMemo(() => {
        let sortableItems = [...filtered];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                let aVal, bVal;
                if (sortConfig.key === 'paciente') {
                    aVal = `${a.nombre} ${a.apellido}`.toLowerCase();
                    bVal = `${b.nombre} ${b.apellido}`.toLowerCase();
                } else {
                    aVal = (a[sortConfig.key] || '').toString().toLowerCase();
                    bVal = (b[sortConfig.key] || '').toString().toLowerCase();
                }

                if (aVal < bVal) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filtered, sortConfig]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedData.slice(startIndex, endIndex);
    }, [sortedData, currentPage]);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <span className="sort-icon">⇅</span>;
        }
        return sortConfig.direction === 'asc' ? 
            <span className="sort-icon active">▲</span> : 
            <span className="sort-icon active">▼</span>;
    };

    return (
        <div style={{ padding: '4px 0' }}>
            {/* Header */}
            <div className="mod-header">
                <h1 className="mod-title">
                    <span className="mod-title-icon blue">👤</span>
                    Gestión de Pacientes
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="mod-count-chip">📋 {pacientes.length} pacientes</span>
                    {!esMedico && (
                        <Link to="/pacientes/nuevo" className="mod-btn-add">➕ Nuevo Paciente</Link>
                    )}
                </div>
            </div>

            {/* Search */}
            <div className="mod-search-wrap">
                <span className="mod-search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Buscar por nombre, DNI o email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="mod-table-card">
                <table ref={tableRef}>
                    <thead>
                        <tr>
                            <th onClick={(e) => { if (e.target.classList.contains('col-resize-handle')) return; requestSort('paciente'); }} className="sortable-header">
                                <div className="sort-header-content">Paciente {getSortIcon('paciente')}</div>
                            </th>
                            <th onClick={(e) => { if (e.target.classList.contains('col-resize-handle')) return; requestSort('dni'); }} className="sortable-header">
                                <div className="sort-header-content">DNI {getSortIcon('dni')}</div>
                            </th>
                            <th onClick={(e) => { if (e.target.classList.contains('col-resize-handle')) return; requestSort('email'); }} className="sortable-header">
                                <div className="sort-header-content">Email {getSortIcon('email')}</div>
                            </th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? paginatedData.map((paciente) => (
                            <tr key={paciente.id}>
                                <td>
                                    <div className="mod-name-chip">
                                        <div className="mod-avatar blue">{getInitials(paciente.nombre, paciente.apellido)}</div>
                                        <span><strong>{paciente.nombre}</strong> {paciente.apellido}</span>
                                    </div>
                                </td>
                                <td>{paciente.dni}</td>
                                <td>{paciente.email}</td>
                                <td>
                                    <div className="mod-actions">
                                        {esMedico ? (
                                            <Link to={`/pacientes/${paciente.id}/historial`} className="mod-btn view">
                                                📋 Historial
                                            </Link>
                                        ) : (
                                            <>
                                                <Link to={`/pacientes/editar/${paciente.id}`} className="mod-btn edit">
                                                    ✏️ Editar
                                                </Link>
                                                <button className="mod-btn delete" onClick={() => handleDelete(paciente.id)}>
                                                    🗑️ Eliminar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr className="mod-empty">
                                <td colSpan="4">
                                    <span className="mod-empty-icon">👤</span>
                                    <p>No se encontraron pacientes.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination footer */}
                <div className="mod-pagination">
                    <div className="mod-pagination-info">
                        Mostrando <strong>{sortedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> a <strong>{Math.min(currentPage * itemsPerPage, sortedData.length)}</strong> de <strong>{sortedData.length}</strong> pacientes
                    </div>
                    <div className="mod-pagination-controls">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                            disabled={currentPage === 1}
                            className="mod-btn edit"
                        >
                            ◀ Anterior
                        </button>
                        <span className="mod-pagination-pages">
                            Página <strong>{currentPage}</strong> de <strong>{totalPages || 1}</strong>
                        </span>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="mod-btn edit"
                        >
                            Siguiente ▶
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PacientesList;