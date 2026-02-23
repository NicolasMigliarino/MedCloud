const { getConnection, sql } = require('../db');
const getTurnos = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('sp_GetTurnos');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createTurno = async (req, res) => {
    const { profesional_id, paciente_id, fecha_hora_inicio, fecha_hora_fin, estado, motivo_consulta, observaciones_admin } = req.body;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('profesional_id', sql.Int, profesional_id)
            .input('paciente_id', sql.Int, paciente_id)
            .input('fecha_hora_inicio', sql.DateTime, fecha_hora_inicio)
            .input('fecha_hora_fin', sql.DateTime, fecha_hora_fin)
            .input('estado', sql.NVarChar, estado)
            .input('motivo_consulta', sql.NVarChar, motivo_consulta)
            .input('observaciones_admin', sql.NVarChar, observaciones_admin)
            .execute('sp_CreateTurno');
        
        res.json({ msg: 'Turno agendado correctamente' });
    } catch (error) {
        // 👇 AHORA SÍ VEREMOS EL ERROR EN LA TERMINAL NEGRA 👇
        console.error("🚨 ERROR SQL AL CREAR TURNO:", error.message); 
        res.status(500).json({ message: error.message });
    }
};

// RENOMBRADO: setTurno
const setTurno = async (req, res) => {
    const { id } = req.params;
    const { profesional_id, paciente_id, fecha_hora_inicio, fecha_hora_fin, estado, motivo_consulta, observaciones_admin } = req.body;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('profesional_id', sql.Int, profesional_id)
            .input('paciente_id', sql.Int, paciente_id)
            .input('fecha_hora_inicio', sql.DateTime, fecha_hora_inicio)
            .input('fecha_hora_fin', sql.DateTime, fecha_hora_fin)
            .input('estado', sql.NVarChar, estado)
            .input('motivo_consulta', sql.NVarChar, motivo_consulta)
            .input('observaciones_admin', sql.NVarChar, observaciones_admin)
            .execute('sp_SetTurno');
        
        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Turno no encontrado' });

        res.json({ msg: 'Turno actualizado' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteTurno = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .execute('sp_DeleteTurno');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Turno no encontrado' });

        return res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { getTurnos, createTurno, setTurno, deleteTurno };