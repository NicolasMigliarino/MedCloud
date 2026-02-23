const { getConnection, sql } = require('../db');
const getPacientes = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('sp_GetPacientes');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getPaciente = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .execute('sp_GetPaciente'); // Singular

        if (result.recordset.length === 0) return res.status(404).json({ message: 'Paciente no encontrado' });

        return res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createPaciente = async (req, res) => {
    const { nombre, apellido, dni, telefono, email, fecha_nacimiento, obra_social, numero_afiliado,fecha_alta } = req.body;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('dni', sql.VarChar, dni)
            .input('telefono', sql.VarChar, telefono)
            .input('email', sql.VarChar, email)
            .input('fecha_nacimiento', sql.Date, fecha_nacimiento)
            .input('obra_social', sql.VarChar, obra_social)
            .input('numero_afiliado', sql.VarChar, numero_afiliado)
            .input('fecha_alta',sql.VarChar, fecha_alta)
            .execute('sp_CreatePaciente');

        res.json({ msg: 'Paciente registrado correctamente' });
    } catch (error) {
        console.error("🚨 ERROR SQL AL CREAR PACIENTE:", error.message);
        res.status(500).send(error.message);
    }
};

// RENOMBRADO: setPaciente
const setPaciente = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, dni, email } = req.body;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('dni', sql.VarChar, dni)
            .input('email', sql.VarChar, email)
            .execute('sp_SetPaciente');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Paciente no encontrado' });

        res.json({ message: 'Paciente actualizado exitosamente' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deletePaciente = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .execute('sp_DeletePaciente');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Paciente no encontrado' });
        
        return res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { getPacientes, getPaciente, createPaciente, setPaciente, deletePaciente };