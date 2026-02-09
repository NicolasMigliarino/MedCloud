import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ProfesionalesForm = () => {
    const [profesional, setProfesional] = useState({
        nombre: '',
        apellido: '',
        matricula: '',
        especialidad: '',
        telefono: '',
        duracion_turno_promedio: 30
    });
    const navigate = useNavigate();
    const { id } = useParams();

    const handleChange = (e) => {
        setProfesional({ ...profesional, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axios.put(`http://localhost:3000/profesionales/${id}`, profesional);
            } else {
                await axios.post('http://localhost:3000/profesionales', profesional);
            }
            navigate('/profesionales');
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (id) {
            const loadProfesional = async () => {
                const res = await axios.get(`http://localhost:3000/profesionales/${id}`);
                setProfesional(res.data);
            };
            loadProfesional();
        }
    }, [id]);

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h3>{id ? 'Editar Profesional' : 'Crear Profesional'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Nombre</label>
                            <input type="text" name="nombre" value={profesional.nombre} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label>Apellido</label>
                            <input type="text" name="apellido" value={profesional.apellido} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label>Matrícula</label>
                            <input type="text" name="matricula" value={profesional.matricula} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label>Especialidad</label>
                            <input type="text" name="especialidad" value={profesional.especialidad} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label>Teléfono</label>
                            <input type="text" name="telefono" value={profesional.telefono} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label>Duración Turno Promedio (min)</label>
                            <input type="number" name="duracion_turno_promedio" value={profesional.duracion_turno_promedio} onChange={handleChange} className="form-control" />
                        </div>
                        <button type="submit" className="btn btn-success">Guardar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfesionalesForm;