import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './modules.css';
import useResizableColumns from './useResizableColumns';

const getRolBadge = (codigo = '') => {
    const map = {
        ADMIN: 'admin',
        MEDICO: 'medico',
        RECEPCION: 'recepcion',
    };
    return map[codigo.toUpperCase()] ?? 'default';
};

const RolList = () => {
    const [roles, setRoles] = useState([]);
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const tableRef = useResizableColumns();

    const loadRoles = async () => {
        try {
            const res = await axios.get('http://localhost:3000/roles');
            setRoles(res.data);
        } catch (error) {
            console.error('Error cargando roles:', error);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el rol de forma permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:3000/roles/${id}`);
                Swal.fire({ icon: 'success', title: 'Eliminado', text: 'El rol ha sido eliminado.', timer: 1500, showConfirmButton: false });
                loadRoles();
            } catch (error) {
                console.error(error);
                Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el rol. Puede que esté asignado a un usuario.' });
            }
        }
    };

    useEffect(() => { loadRoles(); }, []);

    // Reset to page 1 on search change
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const filtered = useMemo(() => {
        return roles.filter(r =>
            `${r.nombre} ${r.codigo}`.toLowerCase().includes(search.toLowerCase())
        );
    }, [roles, search]);

    const sortedData = useMemo(() => {
        let sortableItems = [...filtered];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                let aVal = (a[sortConfig.key] || '').toString().toLowerCase();
                let bVal = (b[sortConfig.key] || '').toString().toLowerCase();

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
                    <span className="mod-title-icon purple">🛡️</span>
                    Gestión de Roles
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="mod-count-chip">🛡️ {roles.length} roles</span>
                    <Link to="/roles/nuevo" className="mod-btn-add">➕ Nuevo Rol</Link>
                </div>
            </div>

            {/* Search */}
            <div className="mod-search-wrap">
                <span className="mod-search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Buscar por nombre o código..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="mod-table-card">
                <table ref={tableRef}>
                    <thead>
                        <tr>
                            <th onClick={(e) => { if (e.target.classList.contains('col-resize-handle')) return; requestSort('nombre'); }} className="sortable-header">
                                <div className="sort-header-content">Nombre del Rol {getSortIcon('nombre')}</div>
                            </th>
                            <th onClick={(e) => { if (e.target.classList.contains('col-resize-handle')) return; requestSort('codigo'); }} className="sortable-header">
                                <div className="sort-header-content">Código Interno {getSortIcon('codigo')}</div>
                            </th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? paginatedData.map((rol) => (
                            <tr key={rol.id}>
                                <td><strong>{rol.nombre}</strong></td>
                                <td>
                                    <span className={`mod-badge ${getRolBadge(rol.codigo)}`}>
                                        {rol.codigo}
                                    </span>
                                </td>
                                <td>
                                    <div className="mod-actions">
                                        <Link to={`/roles/editar/${rol.id}`} className="mod-btn edit">
                                            ✏️ Editar
                                        </Link>
                                        <button className="mod-btn delete" onClick={() => handleDelete(rol.id)}>
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr className="mod-empty">
                                <td colSpan="3">
                                    <span className="mod-empty-icon">🛡️</span>
                                    <p>No se encontraron roles.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination footer */}
                <div className="mod-pagination">
                    <div className="mod-pagination-info">
                        Mostrando <strong>{sortedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> a <strong>{Math.min(currentPage * itemsPerPage, sortedData.length)}</strong> de <strong>{sortedData.length}</strong> roles
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

export default RolList;