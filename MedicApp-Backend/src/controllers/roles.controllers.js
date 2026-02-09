const { getConnection, sql } = require('../db');
const getRoles = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('getRoles');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createRol = async (req, res) => {
    const { nombre, codigo } = req.body;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('codigo', sql.VarChar, codigo)
            .execute('createRol');
        
        res.json({ msg: 'Rol creado' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// RENOMBRADO: setRol
const setRol = async (req, res) => {
    const { id } = req.params;
    const { nombre, codigo } = req.body;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, nombre)
            .input('codigo', sql.VarChar, codigo)
            .execute('setRol');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Rol no encontrado' });

        res.json({ msg: 'Rol actualizado' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteRol = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .execute('deleteRol');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Rol no encontrado' });

        return res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { getRoles, createRol, setRol, deleteRol };