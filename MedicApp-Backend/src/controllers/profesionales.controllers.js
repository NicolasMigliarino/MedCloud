const { getConnection, sql } = require('../db'); // Asegúrate que la ruta a db sea correcta

// 1. OBTENER LISTA (getProfesionales)
const getProfesionales = async (req, res) => {
    try {
        const pool = await getConnection();
        // Asegúrate que tu SP en SQL se llame así
        const result = await pool.request().execute('sp_GetProfesionales');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// 2. OBTENER UNO (getProfesional)
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

// 3. CREAR (createProfesional)
const createProfesional = async (req, res) => {
    const { nombre, apellido, dni, matricula, especialidad, telefono, duracion_turno_promedio, horarios } = req.body;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('DNI', sql.VarChar, dni)
            .input('matricula', sql.VarChar, matricula)
            .input('especialidad', sql.VarChar, especialidad)
            .input('telefono', sql.VarChar, telefono)
            .input('duracionTurnoPromedio', sql.Int, duracion_turno_promedio)
            .input('HorariosJSON', sql.VarChar(sql.MAX), horarios || null) 
            .execute('sp_CreateProfesional');

       res.json({ msg: 'Paciente registrado correctamente' });
    } catch (error) {
        console.error("🚨 ERROR SQL AL CREAR PACIENTE:", error.message);
        res.status(500).send(error.message);
    }
};

// 4. ACTUALIZAR (setProfesional - ANTES updateProfesional)
const setProfesional = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, dni, matricula, especialidad, telefono, duracion_turno_promedio, horarios } = req.body;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('dni', sql.VarChar, dni)
            .input('matricula', sql.VarChar, matricula)
            .input('especialidad', sql.VarChar, especialidad)
            .input('telefono', sql.VarChar, telefono)
            .input('duracionTurnoPromedio', sql.Int, duracion_turno_promedio)
            .input('HorariosJSON', sql.VarChar(sql.MAX), horarios || null) 
            .execute('sp_SetProfesional');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Profesional no encontrado' });

        res.json({ message: 'Profesional actualizado exitosamente' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// 5. ELIMINAR (deleteProfesional)
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

// --- IMPORTANTE: EL EXPORT DEBE COINCIDIR EXACTAMENTE CON LOS NOMBRES DE ARRIBA ---
module.exports = {
    getProfesionales,
    getProfesional,
    createProfesional,
    setProfesional,    // <--- Verifica que esto no diga updateProfesional
    deleteProfesional
};