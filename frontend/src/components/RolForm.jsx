import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const RolForm = () => {
    const [rol, setRol] = useState({
        nombre: '',
        codigo: ''
    });
    
    const navigate = useNavigate();
    const { id } = useParams();

    // Cargar datos si estamos editando
    useEffect(() => {
        if (id) {
            const loadRol = async () => {
                try {
                    // Nota: Asumimos que tienes un endpoint para obtener un solo rol.
                    // Si no lo tienes en el backend, el form aparecerá vacío al editar.
                    // Podríamos filtrar la lista, pero lo ideal es tener router.get('/roles/:id')
                    /* SI NO TIENES EL ENDPOINT GET /roles/:id, 
                       ESTA PARTE DARÁ ERROR 404 O 500. 
                       AVÍSAME SI NECESITAS EL CÓDIGO BACKEND PARA OBTENER 1 ROL.
                    */
                   // Por ahora intentamos cargarlo de la lista general si no existe el endpoint específico:
                   const res = await axios.get('http://localhost:3000/roles');
                   const rolEncontrado = res.data.find(r => r.id === parseInt(id));
                   if(rolEncontrado) setRol(rolEncontrado);
                } catch (error) {
                    console.error(error);
                }
            };
            loadRol();
        }
    }, [id]);

    const handleChange = (e) => {
        setRol({ ...rol, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axios.put(`http://localhost:3000/roles/${id}`, rol);
                alert('Rol actualizado');
            } else {
                await axios.post('http://localhost:3000/roles', rol);
                alert('Rol creado');
            }
            navigate('/roles');
        } catch (error) {
            console.error(error);
            alert("Error al guardar rol");
        }
    };

    return (
        <div className="card mx-auto mt-4" style={{ maxWidth: '500px' }}>
            <div className="card-header bg-dark text-white">
                <h4>{id ? 'Editar Rol' : 'Crear Nuevo Rol'}</h4>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    
                    <div className="mb-3">
                        <label className="form-label">Nombre del Rol</label>
                        <input 
                            type="text" 
                            name="nombre" 
                            className="form-control" 
                            value={rol.nombre} 
                            onChange={handleChange} 
                            placeholder="Ej: Administrador"
                            required 
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Código Interno</label>
                        <input 
                            type="text" 
                            name="codigo" 
                            className="form-control" 
                            value={rol.codigo} 
                            onChange={handleChange} 
                            placeholder="Ej: ADMIN"
                            required 
                        />
                        <div className="form-text">Usado por el sistema (Mayúsculas recomendado).</div>
                    </div>

                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">Guardar</button>
                        <Link to="/roles" className="btn btn-secondary">Cancelar</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RolForm;