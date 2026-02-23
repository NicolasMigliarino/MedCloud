import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Importamos useParams para leer el ID de la URL

const PacientesForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Aquí capturamos el ID si viene en la ruta (ej: /editar/5)
    
    // Estado inicial vacío
    const [formData, setFormData] = useState({
        nombre: '', 
        apellido: '', 
        dni: '', 
        email: '',
        telefono: '',
        fecha_nacimiento: '', // Necesitamos este para que SQL no se queje
        obra_social: '',
        numero_afiliado: '',
        fecha_alta: ''
    });
    
    // Estado para saber si estamos editando (opcional, para cambiar el título)
    const [isEditing, setIsEditing] = useState(false);

    // --- EFECTO: CARGAR DATOS SI ESTAMOS EDITANDO ---
    useEffect(() => {
        const loadPaciente = async () => {
            if (id) {
                // Si existe el ID, cambiamos a modo edición y buscamos los datos
                setIsEditing(true);
                try {
                    // OJO: Aquí asumo que tienes un endpoint GET /pacientes/:id en tu backend
                    // Si no lo tienes, avísame y lo hacemos rápido.
                    // Por ahora intentará cargar los datos.
                    const response = await axios.get(`http://localhost:3000/pacientes/${id}`);
                    setFormData(response.data);
                } catch (error) {
                    console.error("Error al cargar paciente:", error);
                    alert("No se pudo cargar el paciente para editar.");
                }
            }
        };
        loadPaciente();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // --- MODO EDICIÓN (PUT) ---
                await axios.put(`http://localhost:3000/pacientes/${id}`, formData);
                alert('¡Paciente actualizado con éxito!');
            } else {
                // --- MODO CREACIÓN (POST) ---
                await axios.post('http://localhost:3000/pacientes', formData);
                alert('¡Paciente registrado con éxito!');
            }
            navigate('/'); // Volver a la lista
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error al guardar.');
        }
    };

    return (
        <div className="card shadow-sm mt-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className={`card-header text-white ${isEditing ? 'bg-warning' : 'bg-success'}`}>
                <h5 className="mb-0">
                    {isEditing ? '✏️ Editar Paciente' : '📝 Registrar Nuevo Paciente'}
                </h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input type="text" name="nombre" className="form-control" 
                               value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Apellido</label>
                        <input type="text" name="apellido" className="form-control" 
                               value={formData.apellido} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">DNI</label>
                        <input type="text" name="dni" className="form-control" 
                               value={formData.dni} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="form-control" 
                               value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Fecha de Nacimiento</label>
                        <input type="date" name="fecha_nacimiento" className="form-control" 
                               value={formData.fecha_nacimiento} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Fecha de Alta Paciente</label>
                        <input type="date" name="fecha_nacimiento" className="form-control" 
                               value={formData.fecha_nacimiento} onChange={handleChange} required />
                    </div>

                    <button type="submit" className={`btn w-100 ${isEditing ? 'btn-warning' : 'btn-success'}`}>
                        {isEditing ? 'Actualizar Datos' : 'Guardar Paciente'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PacientesForm;