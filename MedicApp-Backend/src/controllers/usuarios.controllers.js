const { getConnection, sql } = require('../db');

const getUsuarios = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('sp_GetUsuarios');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createUsuario = async (req, res) => {
    const { email, password_hash, rol_id, activo, username, debe_cambiar_pass } = req.body;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('email', sql.VarChar, email)
            .input('password_hash', sql.NVarChar, password_hash)   // Corregido el nombre
            .input('rol_id', sql.Int, rol_id)                      // Corregido el nombre
            .input('activo', sql.Bit, activo)
            .input('fecha_creacion', sql.DateTime, new Date())     // Añadida la fecha actual
            .input('username', sql.VarChar, username)
            .input('debe_cambiar_pass', sql.Bit, debe_cambiar_pass) // Corregido el nombre
            .execute('sp_CreateUsuario');
        
        res.json({ msg: 'Usuario creado' });
    } catch (error) {
        console.error("🚨 ERROR SQL AL CREAR USUARIO:", error.message); 
        res.status(500).send(error.message);
    }
};

const setUsuario = async (req, res) => {
    const { id } = req.params;
    const { email, password_hash, rol_id, activo, username, debe_cambiar_pass } = req.body;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('email', sql.VarChar, email)
            .input('password_hash', sql.NVarChar, password_hash)   // Corregido el nombre
            .input('rol_id', sql.Int, rol_id)                      // Corregido el nombre
            .input('activo', sql.Bit, activo)
            .input('username', sql.VarChar, username)
            .input('debe_cambiar_pass', sql.Bit, debe_cambiar_pass) // Corregido el nombre
            .execute('sp_SetUsuario');
        
        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.json({ msg: 'Usuario actualizado' });
    } catch (error) {
        console.error("🚨 ERROR SQL AL EDITAR USUARIO:", error.message);
        res.status(500).send(error.message);
    }
};

const deleteUsuario = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .execute('sp_DeleteUsuario');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

        return res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { getUsuarios, createUsuario, setUsuario, deleteUsuario };