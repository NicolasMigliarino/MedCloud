const { getConnection, sql } = require('../db');
const getUsuarios = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('getUsuarios');
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
            .input('email', sql.NVarChar, email)
            .input('passwordHash', sql.NVarChar, password_hash)
            .input('rolId', sql.Int, rol_id)
            .input('activo', sql.Bit, activo)
            .input('username', sql.VarChar, username)
            .input('debeCambiarPass', sql.Bit, debe_cambiar_pass)
            .execute('createUsuario');
        
        res.json({ msg: 'Usuario creado' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// RENOMBRADO: setUsuario
const setUsuario = async (req, res) => {
    const { id } = req.params;
    const { email, password_hash, rol_id, activo, username, debe_cambiar_pass } = req.body;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('email', sql.NVarChar, email)
            .input('passwordHash', sql.NVarChar, password_hash)
            .input('rolId', sql.Int, rol_id)
            .input('activo', sql.Bit, activo)
            .input('username', sql.VarChar, username)
            .input('debeCambiarPass', sql.Bit, debe_cambiar_pass)
            .execute('setUsuario');
        
        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.json({ msg: 'Usuario actualizado' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteUsuario = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .execute('deleteUsuario');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

        return res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { getUsuarios, createUsuario, setUsuario, deleteUsuario };