const { getConnection, sql } = require('../db');
const getPacientes = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('getPacientes');
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
            .execute('getPaciente'); // Singular

        if (result.recordset.length === 0) return res.status(404).json({ message: 'Paciente no encontrado' });

        return res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createPaciente = async (req, res) => {
    const { nombre, apellido, dni, telefono, email, fecha_nacimiento, obra_social, numero_afiliado } = req.body;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('dni', sql.VarChar, dni)
            .input('telefono', sql.VarChar, telefono)
            .input('email', sql.VarChar, email)
            .input('fechaNacimiento', sql.Date, fecha_nacimiento)
            .input('obraSocial', sql.VarChar, obra_social)
            .input('numeroAfiliado', sql.VarChar, numero_afiliado)
            .execute('createPaciente');

        res.json({ msg: 'Paciente registrado correctamente' });
    } catch (error) {
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
            .execute('setPaciente');

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
            .execute('deletePaciente');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Paciente no encontrado' });
        
        return res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { getPacientes, getPaciente, createPaciente, setPaciente, deletePaciente };