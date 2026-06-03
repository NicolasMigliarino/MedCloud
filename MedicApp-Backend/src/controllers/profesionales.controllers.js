const { getConnection, sql } = require('../db'); // Conexión a la base de datos SQL Server
const { formatTelefonoAR } = require('../utils/phoneFormatter');

/**
 * Obtener listado completo de profesionales de la salud.
 */
const getProfesionales = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('sp_GetProfesionales');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

/**
 * Obtener un profesional de la salud por su ID único.
 */
const getProfesional = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .execute('sp_GetProfesional');

        if (result.recordset.length === 0) return res.status(404).json({ message: 'Profesional no encontrado' });

        return res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

/**
 * Registrar un nuevo profesional.
 * Normaliza el teléfono celular y guarda la grilla de horarios en formato JSON para simplificar consultas.
 */
const createProfesional = async (req, res) => {
    const { nombre, apellido, dni, matricula, especialidad, telefono, duracion_turno_promedio, horarios, porcentaje_retencion, tipo_matricula, cuit_cuil, fecha_nacimiento, sexo } = req.body;
    
    // Normalizamos el número de teléfono con prefijo "+54 9" para que n8n pueda procesar las notificaciones de WhatsApp
    const telefonoFormateado = formatTelefonoAR(telefono);

    try {
        const pool = await getConnection();
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('DNI', sql.VarChar, dni)
            .input('matricula', sql.VarChar, matricula)
            .input('especialidad', sql.VarChar, especialidad)
            .input('telefono', sql.VarChar, telefonoFormateado)
            .input('duracionTurnoPromedio', sql.Int, duracion_turno_promedio)
            // Se envía la grilla horaria en formato de texto JSON para ser parseado en la base de datos
            .input('HorariosJSON', sql.VarChar(sql.MAX), horarios || null) 
            .input('PorcentajeRetencion', sql.Decimal(5, 2), porcentaje_retencion !== undefined ? porcentaje_retencion : 20.00)
            .input('TipoMatricula', sql.NVarChar, tipo_matricula || null)
            .input('CuitCuil', sql.NVarChar, cuit_cuil || null)
            .input('fecha_nacimiento', sql.Date, fecha_nacimiento || null)
            .input('sexo', sql.NVarChar, sexo || null)
            .execute('sp_CreateProfesional');

        res.json({ msg: 'Profesional registrado correctamente' });
    } catch (error) {
        console.error("🚨 ERROR SQL AL CREAR PROFESIONAL:", error.message);
        res.status(500).send(error.message);
    }
};

/**
 * Actualizar los datos de un profesional de la salud.
 * El porcentaje de retención se calcula restando el porcentaje de honorarios del médico del 100%.
 */
const setProfesional = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, dni, matricula, especialidad, telefono, duracion_turno_promedio, horarios, porcentaje_retencion, tipo_matricula, cuit_cuil, fecha_nacimiento, sexo } = req.body;
    
    // Normalizamos el número de teléfono con prefijo "+54 9"
    const telefonoFormateado = formatTelefonoAR(telefono);

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('dni', sql.VarChar, dni)
            .input('matricula', sql.VarChar, matricula)
            .input('especialidad', sql.VarChar, especialidad)
            .input('telefono', sql.VarChar, telefonoFormateado)
            .input('duracionTurnoPromedio', sql.Int, duracion_turno_promedio)
            .input('porcentajeRetencion', sql.Decimal(5, 2), porcentaje_retencion !== undefined ? porcentaje_retencion : 20.00)
            .input('tipoMatricula', sql.NVarChar, tipo_matricula || null)
            .input('cuit_cuil', sql.NVarChar, cuit_cuil || null)
            .input('fecha_nacimiento', sql.Date, fecha_nacimiento || null)
            .input('sexo', sql.NVarChar, sexo || null)
            .execute('sp_SetProfesional');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Profesional no encontrado' });

        res.json({ message: 'Profesional actualizado exitosamente' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

/**
 * Eliminar un profesional mediante el Stored Procedure.
 */
const deleteProfesional = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .execute('sp_DeleteProfesional');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Profesional no encontrado' });

        return res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    getProfesionales,
    getProfesional,
    createProfesional,
    setProfesional,    
    deleteProfesional
};