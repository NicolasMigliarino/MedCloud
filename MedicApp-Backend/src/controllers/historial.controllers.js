const { getConnection, sql } = require('../db');

// 1. GET: Traer historial
const getHistoriales = async (req, res) => {
    // profesional_id aquí es en realidad el ID del usuario logueado que viene de React
    const { paciente_id, profesional_id } = req.params; 
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('paciente_id', sql.Int, paciente_id)
            .input('usuario_id', sql.Int, profesional_id) // Le mandamos el ID del usuario al SP
            .execute('sp_GetHistorialesClinicos'); 
            
        res.json(result.recordset);
    } catch (error) {
        console.error("🚨 ERROR GET HISTORIAL:", error.message);
        res.status(500).send(error.message);
    }
};

// 2. CREATE: Guardar nueva evolución
const createHistorial = async (req, res) => {
    const { paciente_id, profesional_id, turno_id, motivo, evolucion, diagnostico, tratamiento, archivos_adjuntos_url } = req.body;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('paciente_id', sql.Int, paciente_id)
            .input('usuario_id', sql.Int, profesional_id) // Le mandamos el ID del usuario al SP
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

// 3. EDIT: Actualizar evolución
const setHistorial = async (req, res) => {
    const { id } = req.params;
    const { motivo, evolucion, diagnostico, tratamiento, archivos_adjuntos_url } = req.body;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('motivo', sql.NVarChar, motivo || '')
            .input('evolucion', sql.NVarChar, evolucion)
            .input('diagnostico', sql.NVarChar, diagnostico || '')
            .input('tratamiento', sql.NVarChar, tratamiento || '')
            .input('archivos_adjuntos_url', sql.NVarChar, archivos_adjuntos_url || '')
            .execute('sp_SetHistorialesClinicos');
        
        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Historial no encontrado' });

        res.json({ msg: 'Historia clínica actualizada' });
    } catch (error) {
        console.error("🚨 ERROR EDIT HISTORIAL:", error.message);
        res.status(500).send(error.message);
    }
};

// 4. DELETE: Borrar evolución
const deleteHistorial = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .execute('sp_DeleteHistorialClinico');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Historial no encontrado' });

        return res.sendStatus(204);
    } catch (error) {
        console.error("🚨 ERROR DELETE HISTORIAL:", error.message);
        res.status(500).send(error.message);
    }
};

// 5. COMPARTIR: Dar permisos
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

module.exports = { getHistoriales, createHistorial, setHistorial, deleteHistorial, compartirHistorial };