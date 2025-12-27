const { getConnection, sql } = require('../db');

//---Get Pacientes---

const getPacientes = async (req, res) => {
    try {
        const pool = await getConnection();
        // Hacemos la consulta a tu tabla
        const result = await pool.request().query('SELECT * FROM Pacientes');
        
        // Respondemos al navegador con la lista de pacientes
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// ---Crear Paciente ---
const createPaciente = async (req, res) => {
    // Recibimos los datos que nos envía el usuario
    const { nombre, apellido, dni, telefono, email, fecha_nacimiento, obra_social, numero_afiliado } = req.body;

    // Validación básica
    if (!nombre || !dni) {
        return res.status(400).json({ msg: 'Por favor llene los campos obligatorios (Nombre y DNI)' });
    }

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
            .query('INSERT INTO Pacientes (nombre, apellido, dni, telefono, email, fecha_nacimiento, obra_social, numero_afiliado) VALUES (@nombre, @apellido, @dni, @telefono, @email, @fecha_nacimiento, @obra_social, @numero_afiliado)');

        res.json({ msg: 'Paciente registrado correctamente' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// ---Actualizar Paciente ---
const updatePaciente = async (req, res) => {
    // El ID viene en la URL (ej: /pacientes/1)
    const { id } = req.params;
    // Los datos nuevos vienen en el cuerpo (body)
    const { nombre, apellido, dni, telefono, email, obra_social, numero_afiliado } = req.body;

    // Validación simple
    if (!nombre || !dni) {
        return res.status(400).json({ msg: 'Por favor llene los campos obligatorios' });
    }

    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('dni', sql.VarChar, dni)
            .input('telefono', sql.VarChar, telefono)
            .input('email', sql.VarChar, email)
            .input('obra_social', sql.VarChar, obra_social)
            .input('numero_afiliado', sql.VarChar, numero_afiliado)
            .query('UPDATE Pacientes SET nombre = @nombre, apellido = @apellido, dni = @dni, telefono = @telefono, email = @email, obra_social = @obra_social, numero_afiliado = @numero_afiliado WHERE id = @id');

        res.json({ msg: 'Paciente actualizado correctamente' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --- Eliminar Paciente ---
const deletePaciente = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Pacientes WHERE id = @id');

        res.sendStatus(204); // 204 significa "Operación exitosa, sin contenido que devolver"
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// ¡Actualiza el exports del final!
module.exports = {
    getPacientes,
    createPaciente,
    updatePaciente,
    deletePaciente
};
