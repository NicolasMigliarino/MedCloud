const { getConnection, sql } = require('../db');
const getHistoriales = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('sp_GetHistorialesClinicos');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createHistorial = async (req, res) => {
    const { paciente_id, profesional_id, turno_id, motivo, evolucion, diagnostico, tratamiento, archivos_adjuntos_url } = req.body;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('paciente_id', sql.Int, paciente_id)
            .input('profesional_id', sql.Int, profesional_id)
            .input('turnoId', sql.Int, turno_id)
            .input('motivo', sql.NVarChar, motivo)
            .input('evolucion', sql.NVarChar, evolucion)
            .input('diagnostico', sql.NVarChar, diagnostico)
            .input('tratamiento', sql.NVarChar, tratamiento)
            .input('archivosAdjuntosUrl', sql.NVarChar, archivos_adjuntos_url)
            .execute('sp_CreateHistorialClinico');
        
        res.json({ msg: 'Historia clínica guardada' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// RENOMBRADO: setHistorial
const setHistorial = async (req, res) => {
    const { id } = req.params;
    const { motivo, evolucion, diagnostico, tratamiento, archivos_adjuntos_url } = req.body;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('motivo', sql.NVarChar, motivo)
            .input('evolucion', sql.NVarChar, evolucion)
            .input('diagnostico', sql.NVarChar, diagnostico)
            .input('tratamiento', sql.NVarChar, tratamiento)
            .input('archivosAdjuntosUrl', sql.NVarChar, archivos_adjuntos_url)
            .execute('sp_SetHistorialesClinicos');
        
        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Historial no encontrado' });

        res.json({ msg: 'Historia clínica actualizada' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteHistorial = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .execute('sp_DeleteHistorialClinico');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Historial no encontrado' });

        return res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { getHistoriales, createHistorial, setHistorial, deleteHistorial };