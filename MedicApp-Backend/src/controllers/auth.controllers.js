const { getConnection, sql } = require('../db');
const jwt = require('jsonwebtoken');

/**
 * Endpoint de Login de Usuario.
 * Autentica credenciales y genera un token JWT que inyecta los días restantes del trial de demostración.
 */
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await getConnection();

        // Ejecución del Stored Procedure centralizado para autenticación de usuario
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .execute('sp_LoginUsuario'); 

        // 1. Verificar si el usuario existe en la base de datos
        if (result.recordset.length === 0) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const usuario = result.recordset[0];

        // 2. Verificar contraseña en texto plano (según el estado de desarrollo actual)
        if (usuario.password_hash !== password) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        // 3. Generación del JWT Token
        // Se inyecta la propiedad 'trial_dias_restantes' (calculada por sp_LoginUsuario) 
        // para que pueda ser validada de forma ágil y centralizada en el middleware verificarToken.
        const token = jwt.sign(
            { 
                id: usuario.id, 
                username: usuario.username, 
                rol: usuario.rol_codigo,
                trial_dias_restantes: usuario.trial_dias_restantes 
            },
            'PALABRA_SECRETA_SUPER_SEGURA',
            { expiresIn: '8h' }
        );

        // Retornamos el token y los datos básicos del usuario, incluyendo el estado de trial
        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: usuario.id,
                username: usuario.username,
                rol: usuario.rol_codigo,
                rol_nombre: usuario.rol_nombre,
                debe_cambiar_pass: usuario.debe_cambiar_pass,
                trial_dias_restantes: usuario.trial_dias_restantes 
            }
        });

    } catch (error) {
        console.error("Error en endpoint login:", error);
        res.status(500).send(error.message);
    }
};

module.exports = { login };