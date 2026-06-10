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

const { sendPatientReminderEmail } = require('../utils/emailSender');

const enviarEmailRecordatorioHelper = async (turnoId, poolInstance) => {
    const pool = poolInstance || await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, turnoId)
        .query(`
            SELECT 
                t.id, t.fecha_hora_inicio, t.fecha_hora_fin, t.estado, t.motivo_consulta,
                p.nombre AS paciente_nombre, p.apellido AS paciente_apellido, p.email AS paciente_email,
                pr.nombre AS profesional_nombre, pr.apellido AS profesional_apellido, pr.especialidad AS profesional_especialidad
            FROM Turnos t
            INNER JOIN Pacientes p ON t.paciente_id = p.id
            INNER JOIN Profesionales pr ON t.profesional_id = pr.id
            WHERE t.id = @id
        `);

    if (result.recordset.length === 0) {
        throw new Error('Turno no encontrado');
    }

    const turnoInfo = result.recordset[0];
    if (!turnoInfo.paciente_email || !turnoInfo.paciente_email.includes('@')) {
        throw new Error('El paciente no tiene un email válido registrado.');
    }

    // Formatear fecha
    const dateObj = new Date(turnoInfo.fecha_hora_inicio);
    const fechaStr = dateObj.toLocaleDateString('es-AR') + ' a las ' + dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    // Enviar email
    await sendPatientReminderEmail(
        `${turnoInfo.paciente_nombre} ${turnoInfo.paciente_apellido}`,
        turnoInfo.paciente_email,
        `${turnoInfo.profesional_nombre} ${turnoInfo.profesional_apellido}`,
        turnoInfo.profesional_especialidad,
        fechaStr
    );

    // Actualizar flag
    await pool.request()
        .input('id', sql.Int, turnoId)
        .query('UPDATE Turnos SET recordatorio_dia_anterior_enviado = 1, recordatorio_enviado = 1 WHERE id = @id');
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

const enviarRecordatorioManual = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        await enviarEmailRecordatorioHelper(parseInt(id), pool);
        res.json({ message: 'Email de recordatorio enviado correctamente.' });
    } catch (error) {
        console.error("🚨 Error al enviar recordatorio manual:", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getTurnos, 
    createTurno, 
    setTurno, 
    deleteTurno, 
    getHorarios, 
    registrarPagoTurno,
    enviarRecordatorioManual
};