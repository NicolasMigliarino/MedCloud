const { getConnection, sql } = require('../db');
const getTurnos = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('getTurnos');
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
            .input('pacienteId', sql.Int, paciente_id)
            .input('fechaHoraInicio', sql.DateTime, fecha_hora_inicio)
            .input('fechaHoraFin', sql.DateTime, fecha_hora_fin)
            .input('estado', sql.NVarChar, estado)
            .input('motivoConsulta', sql.NVarChar, motivo_consulta)
            .input('observacionesAdmin', sql.NVarChar, observaciones_admin)
            .execute('createTurno');
        
        res.json({ msg: 'Turno agendado correctamente' });
    } catch (error) {
        res.status(500).send(error.message);
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
            .input('pacienteId', sql.Int, paciente_id)
            .input('fechaHoraInicio', sql.DateTime, fecha_hora_inicio)
            .input('fechaHoraFin', sql.DateTime, fecha_hora_fin)
            .input('estado', sql.NVarChar, estado)
            .input('motivoConsulta', sql.NVarChar, motivo_consulta)
            .input('observacionesAdmin', sql.NVarChar, observaciones_admin)
            .execute('setTurno');
        
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
            .execute('deleteTurno');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Turno no encontrado' });

        return res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { getTurnos, createTurno, setTurno, deleteTurno };