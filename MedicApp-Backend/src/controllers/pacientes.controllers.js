const { getConnection, sql } = require('../db');
const getPacientes = async (req, res) => {
    try {
        const pool = await getConnection();
        const request = pool.request();
        
        // Si el token inyectó el req.user, le pasamos su id al Stored Procedure
        if (req.user && req.user.id) {
            request.input('usuario_id', sql.Int, req.user.id);
        }

        const result = await request.execute('sp_GetPacientes');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getPaciente = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .execute('sp_GetPaciente'); // Singular

        if (result.recordset.length === 0) return res.status(404).json({ message: 'Paciente no encontrado' });

        return res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const GetPacientesMenuPrincipal = async (req, res) => {
    try {
        const { term } = req.params;
        const pool = await getConnection();
        const result = await pool.request()
            .input('termino', sql.NVarChar, term)
            .execute('sp_GetPacientesMenuPrincipal');
            
        res.json(result.recordset);
    } catch (error) {
        console.error("Error en buscador global:", error.message);
        res.status(500).send(error.message);
    }
};

//  NUEVO: Obtener la lista de obras sociales
const getObrasSociales = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('sp_GetObrasSociales');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createPaciente = async (req, res) => {
    // Bloquear si el rol es MEDICO
    if (req.user && req.user.rol === 'MEDICO') {
        return res.status(403).json({ message: 'Acceso denegado. Los médicos no pueden registrar pacientes.' });
    }

    // 1. Extraemos obra_social_id y los campos clínicos
    const { nombre, apellido, dni, telefono, email, fecha_nacimiento, obra_social_id, numero_afiliado, fecha_alta, sexo, grupo_sanguineo, direccion, contacto_emergencia, alergias } = req.body;
    
    try {
        const pool = await getConnection();
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('dni', sql.VarChar, dni)
            .input('telefono', sql.VarChar, telefono)
            .input('email', sql.VarChar, email)
            .input('fecha_nacimiento', sql.Date, fecha_nacimiento)
            
            // 👇 2. AQUÍ ESTABA EL ERROR. Usamos obra_social_id y sql.Int
            // (Si viene vacío, mandamos un null para que SQL no se queje)
            .input('obra_social_id', sql.Int, obra_social_id === '' ? null : obra_social_id)
            
            .input('numero_afiliado', sql.VarChar, numero_afiliado)
            .input('fecha_alta', sql.VarChar, fecha_alta)
            .input('sexo', sql.NVarChar, sexo || null)
            .input('grupo_sanguineo', sql.NVarChar, grupo_sanguineo || null)
            .input('direccion', sql.NVarChar, direccion || null)
            .input('contacto_emergencia', sql.NVarChar, contacto_emergencia || null)
            .input('alergias', sql.NVarChar, alergias || null)
            .execute('sp_CreatePaciente');

        res.json({ msg: 'Paciente registrado correctamente' });
    } catch (error) {
        console.error("🚨 ERROR SQL AL CREAR PACIENTE:", error.message);
        res.status(500).send(error.message);
    }
};

// RENOMBRADO: setPaciente
const setPaciente = async (req, res) => {
    // Bloquear si el rol es MEDICO
    if (req.user && req.user.rol === 'MEDICO') {
        return res.status(403).json({ message: 'Acceso denegado. Los médicos no pueden editar pacientes.' });
    }

    const { id } = req.params;
    // 👇 CAMBIO: Agregamos los campos que faltaban para editar completo y los nuevos clínicos
    const { nombre, apellido, dni, email, telefono, fecha_nacimiento, obra_social_id, numero_afiliado, sexo, grupo_sanguineo, direccion, contacto_emergencia, alergias } = req.body;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('dni', sql.VarChar, dni)
            .input('email', sql.VarChar, email)
            .input('telefono', sql.VarChar, telefono)
            .input('fecha_nacimiento', sql.Date, fecha_nacimiento)
            .input('obra_social_id', sql.Int, obra_social_id === '' ? null : obra_social_id) 
            .input('numero_afiliado', sql.VarChar, numero_afiliado)
            .input('sexo', sql.NVarChar, sexo || null)
            .input('grupo_sanguineo', sql.NVarChar, grupo_sanguineo || null)
            .input('direccion', sql.NVarChar, direccion || null)
            .input('contacto_emergencia', sql.NVarChar, contacto_emergencia || null)
            .input('alergias', sql.NVarChar, alergias || null)
            .execute('sp_SetPaciente');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Paciente no encontrado' });

        res.json({ message: 'Paciente actualizado exitosamente' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deletePaciente = async (req, res) => {
    // Bloquear si el rol es MEDICO
    if (req.user && req.user.rol === 'MEDICO') {
        return res.status(403).json({ message: 'Acceso denegado. Los médicos no pueden eliminar pacientes.' });
    }

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .execute('sp_DeletePaciente');

        if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Paciente no encontrado' });
        
        return res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { getPacientes, getPaciente, createPaciente, setPaciente, deletePaciente,getObrasSociales,GetPacientesMenuPrincipal };