import { useEffect, useState } from 'react';
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

    const filtered = pacientes.filter(p =>
        `${p.nombre} ${p.apellido} ${p.dni} ${p.email}`.toLowerCase().includes(search.toLowerCase())
    );

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
                    <Link to="/pacientes/nuevo" className="mod-btn-add">➕ Nuevo Paciente</Link>
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
                            <th>#</th>
                            <th>Paciente</th>
                            <th>DNI</th>
                            <th>Email</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map((paciente) => (
                            <tr key={paciente.id}>
                                <td><span className="mod-id">#{paciente.id}</span></td>
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
                                        {esMedico && (
                                            <Link to={`/pacientes/${paciente.id}/historial`} className="mod-btn view">
                                                📋 Historial
                                            </Link>
                                        )}
                                        <Link to={`/pacientes/editar/${paciente.id}`} className="mod-btn edit">
                                            ✏️ Editar
                                        </Link>
                                        <button className="mod-btn delete" onClick={() => handleDelete(paciente.id)}>
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr className="mod-empty">
                                <td colSpan="5">
                                    <span className="mod-empty-icon">👤</span>
                                    <p>No se encontraron pacientes.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PacientesList;