const { getConnection, sql } = require('../db');

const getTurnos = async (req, res) => {
    try {
        const pool = await getConnection();
        // Hacemos un JOIN simple para traer nombres en vez de solo números
        const result = await pool.request().query(`
            SELECT t.*, 
                   m.nombre as medico_nombre, m.apellido as medico_apellido,
                   p.nombre as paciente_nombre, p.apellido as paciente_apellido
            FROM dbo.turnos t
            INNER JOIN dbo.medicos m ON t.medico_id = m.id
            INNER JOIN dbo.pacientes p ON t.paciente_id = p.id
        `);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createTurno = async (req, res) => {
    const { medico_id, paciente_id, fecha_hora_inicio, fecha_hora_fin, estado, motivo_consulta, observaciones_admin } = req.body;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('medico_id', sql.Int, medico_id)
            .input('paciente_id', sql.Int, paciente_id)
            .input('fecha_hora_inicio', sql.DateTime, fecha_hora_inicio)
            .input('fecha_hora_fin', sql.DateTime, fecha_hora_fin)
            .input('estado', sql.NVarChar, estado) // Ej: 'Pendiente', 'Confirmado'
            .input('motivo_consulta', sql.NVarChar, motivo_consulta)
            .input('observaciones_admin', sql.NVarChar, observaciones_admin)
            .query('INSERT INTO dbo.turnos (medico_id, paciente_id, fecha_hora_inicio, fecha_hora_fin, estado, motivo_consulta, observaciones_admin) VALUES (@medico_id, @paciente_id, @fecha_hora_inicio, @fecha_hora_fin, @estado, @motivo_consulta, @observaciones_admin)');
        
        res.json({ msg: 'Turno agendado correctamente' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateTurno = async (req, res) => {
    const { id } = req.params;
    const { medico_id, paciente_id, fecha_hora_inicio, fecha_hora_fin, estado, motivo_consulta, observaciones_admin } = req.body;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('medico_id', sql.Int, medico_id)
            .input('paciente_id', sql.Int, paciente_id)
            .input('fecha_hora_inicio', sql.DateTime, fecha_hora_inicio)
            .input('fecha_hora_fin', sql.DateTime, fecha_hora_fin)
            .input('estado', sql.NVarChar, estado)
            .input('motivo_consulta', sql.NVarChar, motivo_consulta)
            .input('observaciones_admin', sql.NVarChar, observaciones_admin)
            .query('UPDATE dbo.turnos SET medico_id=@medico_id, paciente_id=@paciente_id, fecha_hora_inicio=@fecha_hora_inicio, fecha_hora_fin=@fecha_hora_fin, estado=@estado, motivo_consulta=@motivo_consulta, observaciones_admin=@observaciones_admin WHERE id=@id');
        
        res.json({ msg: 'Turno actualizado' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteTurno = async (req, res) => {
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
            return res.status(404).json({ message: 'No se encontró el Turno para eliminar' });
        }
        // Si llegó hasta aquí, rowsAffected fue mayor a 0, así que el borrado fue exitoso.
        // Respondemos 204 (No Content), que es el estándar para un borrado exitoso (no devolvemos datos, solo confirmación).
        return res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al intentar eliminar' });
    }
};

module.exports = { getTurnos, createTurno, updateTurno, deleteTurno };