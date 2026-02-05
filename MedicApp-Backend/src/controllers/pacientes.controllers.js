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

// ESTA ES PARA EDITAR (Trae uno solo - CÁMBIALE EL NOMBRE A SINGULAR)
const getPaciente = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM Pacientes WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        return res.json(result.recordset[0]);
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
    // 1. Capturamos el ID de la URL
    const { id } = req.params;
    
    // 2. Capturamos los datos que vienen del formulario (OJO: deben coincidir con los "name" del frontend)
    const { nombre, apellido, dni, email } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('dni', sql.VarChar, dni)    // Asegúrate que en SQL la columna se llame 'dni'
            .input('email', sql.VarChar, email) // Asegúrate que en SQL la columna se llame 'email'
            // 3. La consulta SQL exacta
            .query('UPDATE Pacientes SET nombre=@nombre, apellido=@apellido, dni=@dni, email=@email WHERE id=@id');

        // 4. Validación de que algo se actualizó
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        res.json({ message: 'Paciente actualizado exitosamente' });
    } catch (error) {
        console.error(error); // Esto mostrará el error real en tu terminal negra
        res.status(500).json({ error: error.message });
    }
};

// --- Eliminar Paciente ---
const deletePaciente = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        
        // PASO 1: Guardamos el resultado de la operación en la constante 'result'
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Medicos WHERE id = @id');

        // 'rowsAffected' es un array que devuelve SQL Server indicando cuántas filas sufrieron cambios.
        // Si rowsAffected[0] es 0, significa que la instrucción corrió bien, pero no encontró a nadie con ese ID.
        if (result.rowsAffected[0] === 0) {
            // Devolvemos 404 (Not Found) para avisar al Frontend que no se borró nada porque no existía.
            return res.status(404).json({ message: 'No se encontró el Paciente para eliminar' });
        }
        // Si llegó hasta aquí, rowsAffected fue mayor a 0, así que el borrado fue exitoso.
        // Respondemos 204 (No Content), que es el estándar para un borrado exitoso (no devolvemos datos, solo confirmación).
        return res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al intentar eliminar' });
    }
};

// ¡Actualiza el exports del final!
module.exports = {
    getPacientes,
    getPaciente,
    createPaciente,
    updatePaciente,
    deletePaciente
};
