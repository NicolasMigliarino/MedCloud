const { getConnection, sql } = require('../db');

const getHistoriales = async (req, res) => {
    try {
        const pool = await getConnection();
        // Traemos también datos del paciente para saber de quién es la historia
        const result = await pool.request().query(`
            SELECT h.*, p.nombre, p.apellido 
            FROM dbo.historial_clinico h
            INNER JOIN dbo.pacientes p ON h.paciente_id = p.id
        `);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createHistorial = async (req, res) => {
    const { paciente_id, medico_id, turno_id, motivo, evolucion, diagnostico, tratamiento, archivos_adjuntos_url } = req.body;
    const fecha_registro = new Date(); // Fecha actual automática

    try {
        const pool = await getConnection();
        await pool.request()
            .input('paciente_id', sql.Int, paciente_id)
            .input('medico_id', sql.Int, medico_id)
            .input('turno_id', sql.Int, turno_id) // Puede ser NULL si no viene de un turno
            .input('fecha_registro', sql.DateTime, fecha_registro)
            .input('motivo', sql.NVarChar, motivo)
            .input('evolucion', sql.NVarChar, evolucion)
            .input('diagnostico', sql.NVarChar, diagnostico)
            .input('tratamiento', sql.NVarChar, tratamiento)
            .input('archivos_adjuntos_url', sql.NVarChar, archivos_adjuntos_url)
            .query('INSERT INTO dbo.historial_clinico (paciente_id, medico_id, turno_id, fecha_registro, motivo, evolucion, diagnostico, tratamiento, archivos_adjuntos_url) VALUES (@paciente_id, @medico_id, @turno_id, @fecha_registro, @motivo, @evolucion, @diagnostico, @tratamiento, @archivos_adjuntos_url)');
        
        res.json({ msg: 'Historia clínica guardada' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateHistorial = async (req, res) => {
    const { id } = req.params;
    const { motivo, evolucion, diagnostico, tratamiento, archivos_adjuntos_url } = req.body;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('motivo', sql.NVarChar, motivo)
            .input('evolucion', sql.NVarChar, evolucion)
            .input('diagnostico', sql.NVarChar, diagnostico)
            .input('tratamiento', sql.NVarChar, tratamiento)
            .input('archivos_adjuntos_url', sql.NVarChar, archivos_adjuntos_url)
            .query('UPDATE dbo.historial_clinico SET motivo=@motivo, evolucion=@evolucion, diagnostico=@diagnostico, tratamiento=@tratamiento, archivos_adjuntos_url=@archivos_adjuntos_url WHERE id=@id');
        
        res.json({ msg: 'Historia clínica actualizada' });
        
      // --- VALIDACIÓN NUEVA ---
        if (result.rowsAffected[0] === 0) {
            // Si SQL dice que tocó 0 filas, es que el ID no existe
            return res.status(404).json({ message: 'Médico no encontrado' });
        }

        res.json({ msg: 'Paciente actualizado correctamente' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteHistorial = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        
        // PASO 1: Guardamos el resultado de la operación en la constante 'result'
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM historial_clinico WHERE id = @id');

        // 'rowsAffected' es un array que devuelve SQL Server indicando cuántas filas sufrieron cambios.
        // Si rowsAffected[0] es 0, significa que la instrucción corrió bien, pero no encontró a nadie con ese ID.
        if (result.rowsAffected[0] === 0) {
            // Devolvemos 404 (Not Found) para avisar al Frontend que no se borró nada porque no existía.
            return res.status(404).json({ message: 'No se encontró el Historial para eliminar' });
        }
        // Si llegó hasta aquí, rowsAffected fue mayor a 0, así que el borrado fue exitoso.
        // Respondemos 204 (No Content), que es el estándar para un borrado exitoso (no devolvemos datos, solo confirmación).
        return res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al intentar eliminar' });
    }
};

module.exports = { getHistoriales, createHistorial, updateHistorial, deleteHistorial };