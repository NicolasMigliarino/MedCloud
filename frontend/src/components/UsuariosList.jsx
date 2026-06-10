import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './modules.css';
import useResizableColumns from './useResizableColumns';

const getInitials = (username = '') =>
    username.slice(0, 2).toUpperCase();

const UsuariosList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const tableRef = useResizableColumns();

    const loadUsuarios = async () => {
        try {
            const res = await axios.get('http://localhost:3000/usuarios');
            setUsuarios(res.data);
        } catch (error) {
            console.error('Error cargando usuarios:', error);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará al usuario de forma permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:3000/usuarios/${id}`);
                Swal.fire({ icon: 'success', title: 'Eliminado', text: 'El usuario ha sido eliminado.', timer: 1500, showConfirmButton: false });
                loadUsuarios();
            } catch (error) {
                console.error(error);
                Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar al usuario.' });
            }
        }
    };

    useEffect(() => { loadUsuarios(); }, []);

    // Reset to page 1 on search change
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const filtered = useMemo(() => {
        return usuarios.filter(u =>
            `${u.username} ${u.email}`.toLowerCase().includes(search.toLowerCase())
        );
    }, [usuarios, search]);

    const sortedData = useMemo(() => {
        let sortableItems = [...filtered];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                let aVal, bVal;
                if (sortConfig.key === 'activo') {
                    aVal = a.activo ? 1 : 0;
                    bVal = b.activo ? 1 : 0;
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
                    <span className="mod-title-icon rose">🔑</span>
                    Gestión de Usuarios
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="mod-count-chip">👥 {usuarios.length} usuarios</span>
                    <Link to="/usuarios/nuevo" className="mod-btn-add">➕ Nuevo Usuario</Link>
                </div>
            </div>

            {/* Search */}
            <div className="mod-search-wrap">
                <span className="mod-search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Buscar por username o email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="mod-table-card">
                <table ref={tableRef}>
                    <thead>
                        <tr>
                            <th onClick={(e) => { if (e.target.classList.contains('col-resize-handle')) return; requestSort('username'); }} className="sortable-header">
                                <div className="sort-header-content">Usuario {getSortIcon('username')}</div>
                            </th>
                            <th onClick={(e) => { if (e.target.classList.contains('col-resize-handle')) return; requestSort('email'); }} className="sortable-header">
                                <div className="sort-header-content">Email {getSortIcon('email')}</div>
                            </th>
                            <th onClick={(e) => { if (e.target.classList.contains('col-resize-handle')) return; requestSort('rol_id'); }} className="sortable-header">
                                <div className="sort-header-content">Rol ID {getSortIcon('rol_id')}</div>
                            </th>
                            <th onClick={(e) => { if (e.target.classList.contains('col-resize-handle')) return; requestSort('activo'); }} className="sortable-header">
                                <div className="sort-header-content">Estado {getSortIcon('activo')}</div>
                            </th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? paginatedData.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className="mod-name-chip">
                                        <div className="mod-avatar purple">{getInitials(user.username)}</div>
                                        <strong>{user.username}</strong>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td><span className="mod-code">{user.rol_id}</span></td>
                                <td>
                                    <span className={`mod-badge ${user.activo ? 'activo' : 'inactivo'}`}>
                                        {user.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    <div className="mod-actions">
                                        <Link to={`/usuarios/editar/${user.id}`} className="mod-btn edit">
                                            ✏️ Editar
                                        </Link>
                                        <button className="mod-btn delete" onClick={() => handleDelete(user.id)}>
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr className="mod-empty">
                                <td colSpan="5">
                                    <span className="mod-empty-icon">👥</span>
                                    <p>No se encontraron usuarios.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination footer */}
                <div className="mod-pagination">
                    <div className="mod-pagination-info">
                        Mostrando <strong>{sortedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> a <strong>{Math.min(currentPage * itemsPerPage, sortedData.length)}</strong> de <strong>{sortedData.length}</strong> usuarios
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

export default UsuariosList;