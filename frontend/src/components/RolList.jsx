import { useEffect, useState } from 'react';
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

    const filtered = roles.filter(r =>
        `${r.nombre} ${r.codigo}`.toLowerCase().includes(search.toLowerCase())
    );

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
                            <th>Nombre del Rol</th>
                            <th>Código Interno</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map((rol) => (
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
            </div>
        </div>
    );
};

export default RolList;