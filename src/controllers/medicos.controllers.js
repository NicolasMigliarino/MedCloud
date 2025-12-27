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
        await pool.request()
            // CORRECCIÓN 1: La etiqueta debe llamarse 'id' para coincidir con el WHERE @id
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('matricula', sql.VarChar, matricula)
            .input('especialidad', sql.VarChar, especialidad)
            .input('telefono', sql.VarChar, telefono)
            .input('duracion_turno_promedio', sql.Int, duracion_turno_promedio)
            // CORRECCIÓN 2: Quitamos 'usuario_id' del SET y nos aseguramos de usar WHERE id=@id
            .query('UPDATE Medicos SET nombre=@nombre, apellido=@apellido, matricula=@matricula, especialidad=@especialidad, telefono=@telefono, duracion_turno_promedio=@duracion_turno_promedio WHERE id=@id');
        
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
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Medicos WHERE id=@id');
        
        res.json({ message: 'Médico eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el médico' });
    }
};

// ¡IMPORTANTE! Esto faltaba al final para que el archivo de rutas funcione
module.exports = {
    getMedicos,
    createMedico,
    updateMedico,
    deleteMedico
};