const { getConnection, sql } = require('../db');

// El médico siempre se identifica con el usuario del token (req.user.id), nunca con datos del cliente.

// 1. GET: Traer historial
const getHistoriales = async (req, res) => {
    const { paciente_id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('paciente_id', sql.Int, paciente_id)
            .input('usuario_id', sql.Int, req.user.id) // El SP filtra por privacidad según el usuario logueado
            .execute('sp_GetHistorialesClinicos');

        res.json(result.recordset);
    } catch (error) {
        console.error("🚨 ERROR GET HISTORIAL:", error.message);
        res.status(500).send(error.message);
    }
};

// 2. CREATE: Guardar nueva evolución
const createHistorial = async (req, res) => {
    const { paciente_id, turno_id, motivo, evolucion, diagnostico, tratamiento, archivos_adjuntos_url } = req.body;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('paciente_id', sql.Int, paciente_id)
            .input('usuario_id', sql.Int, req.user.id) // El SP resuelve el profesional a partir del usuario
            .input('turno_id', sql.Int, turno_id || null)
            .input('motivo', sql.NVarChar, motivo || '')
            .input('evolucion', sql.NVarChar, evolucion)
            .input('diagnostico', sql.NVarChar, diagnostico || '')
            .input('tratamiento', sql.NVarChar, tratamiento || '')
            .input('archivos_adjuntos_url', sql.NVarChar, archivos_adjuntos_url || '')
            .execute('sp_CreateHistorialClinico');

        res.json({ msg: 'Historia clínica guardada' });
    } catch (error) {
        console.error("🚨 ERROR CREATE HISTORIAL:", error.message);
        res.status(500).send(error.message);
    }
};

// 3. COMPARTIR: Dar permisos
const compartirHistorial = async (req, res) => {
    const { historial_id, profesional_invitado_id } = req.body;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('historial_id', sql.Int, historial_id)
            .input('profesional_invitado_id', sql.Int, profesional_invitado_id)
            .execute('sp_Set_CompartirHistorial');

        res.json({ msg: 'Acceso de lectura otorgado con éxito' });
    } catch (error) {
        console.error("🚨 ERROR COMPARTIR HISTORIAL:", error.message);
        res.status(500).send(error.message);
    }
};

module.exports = { getHistoriales, createHistorial, compartirHistorial };
