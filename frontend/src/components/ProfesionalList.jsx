import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './modules.css';
import useResizableColumns from './useResizableColumns';

const getInitials = (nombre = '', apellido = '') =>
    `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

const ProfesionalesList = () => {
    const [profesionales, setProfesionales] = useState([]);
    const [search, setSearch] = useState('');
    const tableRef = useResizableColumns();

    const loadProfesionales = async () => {
        try {
            const res = await axios.get('http://localhost:3000/profesionales');
            setProfesionales(res.data);
        } catch (error) {
            console.error('Error cargando profesionales:', error);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará al profesional de forma permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:3000/profesionales/${id}`);
                Swal.fire({ icon: 'success', title: 'Eliminado', text: 'El profesional ha sido borrado del sistema.', timer: 1500, showConfirmButton: false });
                loadProfesionales();
            } catch (error) {
                console.error('Error al eliminar:', error);
                Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar al profesional.' });
            }
        }
    };

    useEffect(() => { loadProfesionales(); }, []);

    const filtered = profesionales.filter(p =>
        `${p.nombre} ${p.apellido} ${p.matricula} ${p.especialidad}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding: '4px 0' }}>
            {/* Header */}
            <div className="mod-header">
                <h1 className="mod-title">
                    <span className="mod-title-icon teal">🩺</span>
                    Gestión de Profesionales
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="mod-count-chip">🩺 {profesionales.length} profesionales</span>
                    <Link to="/profesionales/nuevo" className="mod-btn-add">➕ Nuevo Profesional</Link>
                </div>
            </div>

            {/* Search */}
            <div className="mod-search-wrap">
                <span className="mod-search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Buscar por nombre, matrícula o especialidad..."
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
                            <th>Profesional</th>
                            <th>Matrícula</th>
                            <th>Especialidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map((prof) => (
                            <tr key={prof.id}>
                                <td><span className="mod-id">#{prof.id}</span></td>
                                <td>
                                    <div className="mod-name-chip">
                                        <div className="mod-avatar teal">{getInitials(prof.nombre, prof.apellido)}</div>
                                        <span><strong>Dr. {prof.nombre}</strong> {prof.apellido}</span>
                                    </div>
                                </td>
                                <td><span className="mod-code">{prof.matricula}</span></td>
                                <td><span className="mod-specialty">{prof.especialidad}</span></td>
                                <td>
                                    <div className="mod-actions">
                                        <Link to={`/profesionales/editar/${prof.id}`} className="mod-btn edit">
                                            ✏️ Editar
                                        </Link>
                                        <button className="mod-btn delete" onClick={() => handleDelete(prof.id)}>
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr className="mod-empty">
                                <td colSpan="5">
                                    <span className="mod-empty-icon">🩺</span>
                                    <p>No se encontraron profesionales.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProfesionalesList;