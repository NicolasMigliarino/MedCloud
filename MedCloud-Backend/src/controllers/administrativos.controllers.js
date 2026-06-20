const { getConnection, sql } = require('../db');
const getAdministrativos = async (req, res) => {
    try {
        const pool = await getConnection();
        // SP: getAdministrativos
        const result = await pool.request().execute('getAdministrativos');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createAdministrativo = async (req, res) => {
    const { usuario_id, nombre, apellido } = req.body;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('usuarioId', sql.Int, usuario_id)
            .input('nombre', sql.NVarChar, nombre)
            .input('apellido', sql.NVarChar, apellido)
            .execute('createAdministrativo'); 
        
        res.json({ msg: 'Administrativo creado' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// RENOMBRADO: setAdministrativo
const setAdministrativo = async (req, res) => {
    const { id } = req.params;
    const { usuario_id, nombre, apellido } = req.body;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('usuarioId', sql.Int, usuario_id)
            .input('nombre', sql.NVarChar, nombre)
            .input('apellido', sql.NVarChar, apellido)
            .execute('setAdministrativo');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Administrativo no encontrado' });

        res.json({ msg: 'Administrativo actualizado' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteAdministrativo = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .execute('deleteAdministrativo');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Administrativo no encontrado' });

        return res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { getAdministrativos, createAdministrativo, setAdministrativo, deleteAdministrativo };