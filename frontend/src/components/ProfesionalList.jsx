import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProfesionalesList = () => {
    const [profesionales, setProfesionales] = useState([]);

    const loadProfesionales = async () => {
        try {
            // Nota: Ahora llamamos a /profesionales
            const res = await axios.get('http://localhost:3000/profesionales');
            setProfesionales(res.data);
        } catch (error) {
            console.error("Error cargando profesionales:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que quieres eliminar este profesional?")) {
            try {
                await axios.delete(`http://localhost:3000/profesionales/${id}`);
                loadProfesionales();
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        loadProfesionales();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Lista de Profesionales</h2>
            <div className="d-flex justify-content-end mb-3">
                <Link to="/profesionales/nuevo" className="btn btn-primary">Nuevo Profesional</Link>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Matrícula</th>
                        <th>Especialidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {profesionales.map((prof) => (
                        <tr key={prof.id}>
                            <td>{prof.nombre}</td>
                            <td>{prof.apellido}</td>
                            <td>{prof.matricula}</td>
                            <td>{prof.especialidad}</td>
                            <td>
                                <Link to={`/profesionales/editar/${prof.id}`} className="btn btn-warning btn-sm me-2">Editar</Link>
                                <button onClick={() => handleDelete(prof.id)} className="btn btn-danger btn-sm">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProfesionalesList;