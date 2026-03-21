const { getConnection, sql } = require('../db');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await getConnection();

        // CORRECCIÓN: Usamos el Stored Procedure en lugar de escribir la query aquí
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .execute('sp_LoginUsuario'); // <--- Llamada al SP

        // 1. Verificar si el usuario existe
        if (result.recordset.length === 0) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const usuario = result.recordset[0];

        // 2. Verificar contraseña (sigue siendo en el backend por ahora)
        if (usuario.password_hash !== password) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        // 3. Crear Token
        const token = jwt.sign(
            { id: usuario.id, username: usuario.username, rol: usuario.rol_codigo },
            'PALABRA_SECRETA_SUPER_SEGURA',
            { expiresIn: '8h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: usuario.id,
                username: usuario.username,
                rol: usuario.rol_codigo,
                rol_nombre: usuario.rol_nombre,
                debe_cambiar_pass: usuario.debe_cambiar_pass
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

module.exports = { login };