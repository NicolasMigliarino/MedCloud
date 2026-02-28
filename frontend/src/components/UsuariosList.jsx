import { useEffect, useState } from 'react';
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

    const filtered = usuarios.filter(u =>
        `${u.username} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    );

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
                            <th>#</th>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Rol ID</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map((user) => (
                            <tr key={user.id}>
                                <td><span className="mod-id">#{user.id}</span></td>
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
                                <td colSpan="6">
                                    <span className="mod-empty-icon">👥</span>
                                    <p>No se encontraron usuarios.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsuariosList;