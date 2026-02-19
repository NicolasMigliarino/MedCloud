import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Importamos los estilos oscuros

const LoginPage = () => {
    // true = Muestra Login (Panel Azul a la derecha)
    // false = Muestra Registro (Panel Azul a la izquierda)
    const [isLoginView, setIsLoginView] = useState(true);
    
    // Estados para los formularios
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', rol_id: 5 }); // 5 = MEDICO por defecto, o el que quieras
    const [roles, setRoles] = useState([]);
    
    const navigate = useNavigate();

    // Cargar roles para el registro (Opcional, si quieres un select)
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await axios.get('http://localhost:3000/roles');
                setRoles(res.data);
            } catch (err) {
                console.error("Error roles", err);
            }
        };
        fetchRoles();
    }, []);

    // Manejar cambios en inputs
    const handleLoginChange = (e) => setLoginData({...loginData, [e.target.name]: e.target.value});
    const handleRegisterChange = (e) => setRegisterData({...registerData, [e.target.name]: e.target.value});

    // --- ACCIÓN DE LOGIN ---
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/login', loginData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            alert(`¡Hola de nuevo, ${res.data.user.username}!`);
            navigate('/');
            window.location.reload();
        } catch (err) {
            alert('❌ Error: Usuario o contraseña incorrectos');
        }
    };

    // --- ACCIÓN DE REGISTRO (Sign Up) ---
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            // Adaptamos los datos para que coincidan con lo que espera tu API /usuarios
            const payload = {
                username: registerData.username,
                email: registerData.email,
                password_hash: registerData.password, // Tu backend espera snake_case
                rol_id: registerData.rol_id,
                activo: true,
                debe_cambiar_pass: false
            };
            
            await axios.post('http://localhost:3000/usuarios', payload);
            alert('✅ Usuario creado con éxito. Ahora inicia sesión.');
            setIsLoginView(true); // Movemos el panel al Login automáticamente
        } catch (err) {
            alert('❌ Error al registrarse. Revisa los datos.');
        }
    };

    const toggleView = () => setIsLoginView(!isLoginView);

    return (
        <div className="login-container">
            <div className="card-login">
                
                {/* FONDO MÓVIL (EL PANEL AZUL) */}
                {/* Si isLoginView es true, agregamos la clase .login-mode para que se mueva a la derecha */}
                <div className={`card-bg ${isLoginView ? 'login-mode' : ''}`}></div>

                {/* --- HERO LOGIN (Texto "Hello There" - Visible cuando estamos en Register) --- */}
                {/* Este aparece a la izquierda cuando el panel azul se va a la izquierda */}
                <div className={`hero login ${!isLoginView ? 'active' : ''}`}>
                    <h2>¿Ya tienes cuenta?</h2>
                    <p>Inicia sesión para acceder a tus turnos y pacientes.</p>
                    <button onClick={toggleView}>INICIAR SESIÓN</button>
                </div>

                {/* --- FORM LOGIN (Inputs - Visible cuando estamos en Login) --- */}
                <div className={`form-section login ${isLoginView ? 'active' : ''}`}>
                    <h2>Bienvenido</h2>
                    <form onSubmit={handleLoginSubmit}>
                        <input 
                            type="text" name="username" placeholder="Usuario" 
                            onChange={handleLoginChange} required 
                        />
                        <input 
                            type="password" name="password" placeholder="Contraseña" 
                            onChange={handleLoginChange} required 
                        />
                        <button type="submit" className="action-btn">INGRESAR</button>
                    </form>
                </div>

                {/* ------------------------------------------------ */}

                {/* --- HERO REGISTER (Texto "Welcome Back" - Visible cuando estamos en Login) --- */}
                {/* Este aparece a la derecha cuando el panel azul está a la derecha */}
                <div className={`hero register ${isLoginView ? 'active' : ''}`}>
                    <h2>¿Eres nuevo?</h2>
                    <p>Regístrate para comenzar a gestionar tu clínica.</p>
                    <button onClick={toggleView}>REGISTRARSE</button>
                </div>

                {/* --- FORM REGISTER (Inputs - Visible cuando estamos en Register) --- */}
                <div className={`form-section register ${!isLoginView ? 'active' : ''}`}>
                    <h2>Crear Cuenta</h2>
                    <form onSubmit={handleRegisterSubmit}>
                        <input 
                            type="text" name="username" placeholder="Nombre de Usuario" 
                            onChange={handleRegisterChange} required 
                        />
                        <input 
                            type="email" name="email" placeholder="Correo Electrónico" 
                            onChange={handleRegisterChange} required 
                        />
                        <input 
                            type="password" name="password" placeholder="Contraseña" 
                            onChange={handleRegisterChange} required 
                        />
                        
                        {/* Selector de Rol simple */}
                        <select name="rol_id" onChange={handleRegisterChange} value={registerData.rol_id} required>
                             {roles.map(r => (
                                 <option key={r.id} value={r.id}>{r.nombre}</option>
                             ))}
                        </select>

                        <button type="submit" className="action-btn">REGISTRARME</button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;