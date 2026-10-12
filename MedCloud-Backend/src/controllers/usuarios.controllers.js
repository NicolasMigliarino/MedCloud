const { getConnection, sql } = require('../db');
const { ROL_ADMIN, esAdmin, codigoDeRol, SIN_PERMISO_ADMIN } = require('../utils/roles');

const getUsuarios = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('sp_GetUsuarios');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .execute('sp_GetUsuarioById');

        if (result.recordset.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.json(result.recordset[0]);
    } catch (error) {
        console.error("🚨 ERROR SQL AL OBTENER USUARIO:", error.message);
        res.status(500).send(error.message);
    }
};

const createUsuario = async (req, res) => {
    const { email, password_hash, rol_id, activo, username, debe_cambiar_pass } = req.body;
    try {
        const pool = await getConnection();

        // Solo un ADMIN puede crear usuarios con rol ADMIN
        if (!esAdmin(req) && await codigoDeRol(pool, rol_id) === ROL_ADMIN) {
            return res.status(403).json(SIN_PERMISO_ADMIN);
        }

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

// Indica si un usuario existente tiene hoy el rol ADMIN (null si no existe)
const usuarioEsAdmin = async (pool, id) => {
    const result = await pool.request()
        .input('id', sql.Int, id)
        .execute('sp_GetUsuarioById');
    if (result.recordset.length === 0) return null;
    return await codigoDeRol(pool, result.recordset[0].rol_id) === ROL_ADMIN;
};

const setUsuario = async (req, res) => {
    const { id } = req.params;
    const { email, password_hash, rol_id, activo, username, debe_cambiar_pass } = req.body;
    try {
        const pool = await getConnection();

        // Solo un ADMIN puede modificar a un ADMIN o asignar el rol ADMIN
        if (!esAdmin(req)) {
            const destinoEsAdmin = await usuarioEsAdmin(pool, id);
            if (destinoEsAdmin === null) return res.status(404).json({ message: 'Usuario no encontrado' });
            if (destinoEsAdmin || await codigoDeRol(pool, rol_id) === ROL_ADMIN) {
                return res.status(403).json(SIN_PERMISO_ADMIN);
            }
        }

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('email', sql.VarChar, email)
            .input('passwordHash', sql.NVarChar, password_hash || null)
            .input('rolId', sql.Int, rol_id)
            .input('activo', sql.Bit, activo)
            .input('username', sql.VarChar, username)
            .input('debeCambiarPass', sql.Bit, debe_cambiar_pass !== undefined ? debe_cambiar_pass : false)
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

        // Solo un ADMIN puede borrar a un ADMIN
        if (!esAdmin(req)) {
            const destinoEsAdmin = await usuarioEsAdmin(pool, req.params.id);
            if (destinoEsAdmin === null) return res.status(404).json({ message: 'Usuario no encontrado' });
            if (destinoEsAdmin) return res.status(403).json(SIN_PERMISO_ADMIN);
        }

        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .execute('sp_DeleteUsuario');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

        return res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const changePassword = async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    // Cada usuario cambia solo su propia contraseña (un ADMIN puede cambiar cualquiera)
    if (parseInt(id, 10) !== req.user.id && !esAdmin(req)) {
        return res.status(403).json({ message: 'Solo podés cambiar tu propia contraseña.' });
    }

    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('newPassword', sql.NVarChar, newPassword)
            .execute('sp_ChangePassword');

        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error("🚨 ERROR AL CAMBIAR PASSWORD:", error.message);
        res.status(500).send(error.message);
    }
};

module.exports = { getUsuarios, getUsuarioById, createUsuario, setUsuario, deleteUsuario, changePassword };
