const { getConnection, sql } = require('../db');

// --- Get Medicos ---
const getMedicos = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM Medicos');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los médicos' });
    }
};

// --- Crear Medico ---
const createMedico = async (req, res) => {
    // 1. Quitamos 'usuario_id' de aquí, no lo necesitamos todavía
    const { nombre, apellido, matricula, especialidad, telefono, duracion_turno_promedio } = req.body;

    try {
        const pool = await getConnection();
        await pool.request()
            // 2. Quitamos el .input de usuario_id
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('matricula', sql.VarChar, matricula)
            .input('especialidad', sql.VarChar, especialidad)
            .input('telefono', sql.VarChar, telefono)
            .input('duracion_turno_promedio', sql.Int, duracion_turno_promedio)
            // 3. Quitamos usuario_id del INSERT. SQL Server pondrá NULL automáticamente.
            .query('INSERT INTO Medicos (nombre, apellido, matricula, especialidad, telefono, duracion_turno_promedio) VALUES (@nombre, @apellido, @matricula, @especialidad, @telefono, @duracion_turno_promedio)');
        
        res.json({ message: 'Médico creado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el médico' });
    }
};
// --- Actualizar Medico ---
const updateMedico = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, matricula, especialidad, telefono, duracion_turno_promedio } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request() // <--- Guardamos el resultado en una constante
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('matricula', sql.VarChar, matricula)
            .input('especialidad', sql.VarChar, especialidad)
            .input('telefono', sql.VarChar, telefono)
            .input('duracion_turno_promedio', sql.Int, duracion_turno_promedio)
            .query('UPDATE Medicos SET nombre=@nombre, apellido=@apellido, matricula=@matricula, especialidad=@especialidad, telefono=@telefono, duracion_turno_promedio=@duracion_turno_promedio WHERE id=@id');

        // --- VALIDACIÓN NUEVA ---
        if (result.rowsAffected[0] === 0) {
            // Si SQL dice que tocó 0 filas, es que el ID no existe
            return res.status(404).json({ message: 'Médico no encontrado' });
        }

        res.json({ message: 'Médico actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el médico' });
    }

};
// --- Eliminar Medico ---
const deleteMedico = async (req, res) => {
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
            return res.status(404).json({ message: 'No se encontró el Médico para eliminar' });
        }
        // Si llegó hasta aquí, rowsAffected fue mayor a 0, así que el borrado fue exitoso.
        // Respondemos 204 (No Content), que es el estándar para un borrado exitoso (no devolvemos datos, solo confirmación).
        return res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al intentar eliminar' });
    }
};


// ¡IMPORTANTE! Esto faltaba al final para que el archivo de rutas funcione
module.exports = {
    getMedicos,
    createMedico,
    updateMedico,
    deleteMedico
};