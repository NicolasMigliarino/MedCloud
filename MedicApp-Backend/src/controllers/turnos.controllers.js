const { getConnection, sql } = require('../db');
const getTurnos = async (req, res) => {
    try {
        // Extraemos los datos del usuario logueado desde el token (req.user)
        const usuario_id = req.user.id; 
        const rol_codigo = req.user.rol; 

        const pool = await getConnection();
        
        // Le pasamos las credenciales al Stored Procedure
        const result = await pool.request()
            .input('UsuarioID', sql.Int, usuario_id)
            .input('RolCodigo', sql.VarChar, rol_codigo)
            .execute('sp_GetTurnos');
            
        res.json(result.recordset);
    } catch (error) {
        console.error("🚨 ERROR AL OBTENER TURNOS:", error.message);
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

const getHorarios = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('sp_GetHorarios');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const registrarPagoTurno = async (req, res) => {
    try {
        const { id } = req.params;
        const { monto, metodo_pago } = req.body;

        if (!monto || !metodo_pago) {
            return res.status(400).json({ message: 'El monto y el método de pago son obligatorios.' });
        }

        const pool = await getConnection();
        await pool.request()
            .input('turno_id', sql.Int, id)
            .input('monto', sql.Decimal(10, 2), monto)
            .input('metodo_pago', sql.VarChar(50), metodo_pago)
            .input('usuario_registro_id', sql.Int, req.user ? req.user.id : 1)
            .execute('sp_RegistrarPagoTurno');

        res.json({ message: 'Pago registrado exitosamente. El turno ha sido Confirmado de forma automática.' });
    } catch (error) {
        console.error("Error al registrar pago:", error.message);
        res.status(500).send(error.message);
    }
};

module.exports = { getTurnos, createTurno, setTurno, deleteTurno, getHorarios, registrarPagoTurno };