const { getConnection, sql } = require('../db');
const { sendPatientReminderEmail, sendDoctorAgendaEmail } = require('./emailSender');

const procesarRecordatoriosPacientes = async () => {
    try {
        const pool = await getConnection();
        
        // Calcular fecha de mañana
        const mañana = new Date();
        mañana.setDate(mañana.getDate() + 1);
        const mañanaFechaStr = mañana.toISOString().slice(0, 10); // YYYY-MM-DD

        // Buscar turnos para mañana que no se hayan notificado aún
        const pendingResult = await pool.request()
            .input('mañana', sql.Date, mañanaFechaStr)
            .query(`
                SELECT 
                    t.id, t.fecha_hora_inicio, t.estado,
                    p.nombre AS paciente_nombre, p.apellido AS paciente_apellido, p.email AS paciente_email,
                    pr.nombre AS profesional_nombre, pr.apellido AS profesional_apellido, pr.especialidad AS profesional_especialidad
                FROM Turnos t
                INNER JOIN Pacientes p ON t.paciente_id = p.id
                INNER JOIN Profesionales pr ON t.profesional_id = pr.id
                WHERE t.estado != 'Cancelado'
                  AND t.recordatorio_dia_anterior_enviado = 0
                  AND CAST(t.fecha_hora_inicio AS DATE) = @mañana
            `);

        const listado = pendingResult.recordset;
        if (listado.length === 0) return;

        // Despachar envíos en paralelo de forma eficiente
        const promesas = listado.map(async (turno) => {
            if (turno.paciente_email && turno.paciente_email.includes('@')) {
                try {
                    const dateObj = new Date(turno.fecha_hora_inicio);
                    const fechaStr = dateObj.toLocaleDateString('es-AR') + ' a las ' + dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

                    await sendPatientReminderEmail(
                        `${turno.paciente_nombre} ${turno.paciente_apellido}`,
                        turno.paciente_email,
                        `${turno.profesional_nombre} ${turno.profesional_apellido}`,
                        turno.profesional_especialidad,
                        fechaStr
                    );

                    // Marcar como enviado
                    await pool.request()
                        .input('id', sql.Int, turno.id)
                        .query('UPDATE Turnos SET recordatorio_dia_anterior_enviado = 1, recordatorio_enviado = 1 WHERE id = @id');
                    
                    console.log(`📧 Recordatorio enviado al paciente ${turno.paciente_email} para turno ID ${turno.id}`);
                } catch (sendErr) {
                    console.error(`❌ Error al enviar recordatorio por email para turno ID ${turno.id}:`, sendErr.message);
                }
            } else {
                // Marcar como procesado si el paciente no tiene email para evitar bucles
                await pool.request()
                    .input('id', sql.Int, turno.id)
                    .query('UPDATE Turnos SET recordatorio_dia_anterior_enviado = 1 WHERE id = @id');
            }
        });

        await Promise.allSettled(promesas);
    } catch (err) {
        console.error('🚨 Error en procesarRecordatoriosPacientes:', err.message);
    }
};

const procesarAgendasMedicas = async () => {
    const ahora = new Date();
    // Solo enviar si la hora actual es las 20 hs (8:00 PM)
    if (ahora.getHours() !== 20) {
        return;
    }

    try {
        const pool = await getConnection();
        
        // Calcular fecha de mañana
        const mañana = new Date();
        mañana.setDate(mañana.getDate() + 1);
        const mañanaFechaStr = mañana.toISOString().slice(0, 10); // YYYY-MM-DD

        // 1. Buscar profesionales que tienen turnos mañana, tienen usuario/email,
        // y que NO tienen un envío registrado para la fecha de mañana
        const resultProfesionales = await pool.request()
            .input('mañana', sql.Date, mañanaFechaStr)
            .query(`
                SELECT DISTINCT 
                    pr.id AS profesional_id, pr.nombre AS profesional_nombre, pr.apellido AS profesional_apellido,
                    u.email AS profesional_email
                FROM Turnos t
                INNER JOIN Profesionales pr ON t.profesional_id = pr.id
                INNER JOIN Usuarios u ON pr.usuario_id = u.id
                WHERE t.estado != 'Cancelado'
                  AND CAST(t.fecha_hora_inicio AS DATE) = @mañana
                  AND u.activo = 1
                  AND pr.id NOT IN (
                      SELECT profesional_id 
                      FROM envios_agenda_medica 
                      WHERE fecha_agenda = @mañana
                  )
            `);

        const profesionales = resultProfesionales.recordset;
        if (profesionales.length === 0) return;

        // Despachar envíos de agendas en paralelo
        const promesas = profesionales.map(async (prof) => {
            if (prof.profesional_email && prof.profesional_email.includes('@')) {
                try {
                    // 2. Buscar todos los turnos del profesional para mañana
                    const resultTurnos = await pool.request()
                        .input('profesional_id', sql.Int, prof.profesional_id)
                        .input('mañana', sql.Date, mañanaFechaStr)
                        .query(`
                            SELECT 
                                t.fecha_hora_inicio, t.fecha_hora_fin, t.estado, t.motivo_consulta,
                                p.nombre AS paciente_nombre, p.apellido AS paciente_apellido
                            FROM Turnos t
                            INNER JOIN Pacientes p ON t.paciente_id = p.id
                            WHERE t.profesional_id = @profesional_id
                              AND t.estado != 'Cancelado'
                              AND CAST(t.fecha_hora_inicio AS DATE) = @mañana
                            ORDER BY t.fecha_hora_inicio ASC
                        `);

                    const turnos = resultTurnos.recordset;
                    if (turnos.length === 0) return;

                    // 3. Formatear turnos en filas HTML
                    let agendaRowsHTML = '';
                    turnos.forEach((t) => {
                        const inicio = new Date(t.fecha_hora_inicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
                        const fin = new Date(t.fecha_hora_fin).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
                        agendaRowsHTML += `
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                <td style="padding: 12px 8px; font-size: 14px; color: #1e293b;"><strong>${inicio} - ${fin} hs</strong></td>
                                <td style="padding: 12px 8px; font-size: 14px; color: #1e293b;">${t.paciente_nombre} ${t.paciente_apellido}</td>
                                <td style="padding: 12px 8px; font-size: 14px; color: #2563eb; font-weight: 600;">${t.estado}</td>
                                <td style="padding: 12px 8px; font-size: 14px; color: #475569;">${t.motivo_consulta || 'Control general'}</td>
                            </tr>
                        `;
                    });

                    const fechaLegible = mañana.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

                    await sendDoctorAgendaEmail(
                        `${prof.profesional_nombre} ${prof.profesional_apellido}`,
                        prof.profesional_email,
                        fechaLegible,
                        agendaRowsHTML,
                        turnos.length
                    );

                    // 4. Registrar envío
                    await pool.request()
                        .input('profesional_id', sql.Int, prof.profesional_id)
                        .input('fecha_agenda', sql.Date, mañanaFechaStr)
                        .query(`
                            INSERT INTO envios_agenda_medica (profesional_id, fecha_agenda, fecha_envio)
                            VALUES (@profesional_id, @fecha_agenda, GETDATE())
                        `);

                    console.log(`📧 Agenda de mañana enviada con éxito al Dr. ${prof.profesional_apellido} (${prof.profesional_email})`);
                } catch (sendErr) {
                    console.error(`❌ Error al enviar agenda al Dr. ID ${prof.profesional_id}:`, sendErr.message);
                }
            }
        });

        await Promise.allSettled(promesas);
    } catch (err) {
        console.error('🚨 Error en procesarAgendasMedicas:', err.message);
    }
};

const iniciarScheduler = () => {
    console.log('⏰ Scheduler de recordatorios automáticos iniciado (1 día antes a pacientes y 20:00 hs a médicos)...');
    
    // Ejecutar comprobación inicial inmediatamente
    procesarRecordatoriosPacientes();
    procesarAgendasMedicas();

    // Loop cada 10 minutos
    setInterval(procesarRecordatoriosPacientes, 10 * 60 * 1000);
    setInterval(procesarAgendasMedicas, 10 * 60 * 1000);
};

module.exports = { 
    iniciarScheduler,
    procesarRecordatoriosPacientes,
    procesarAgendasMedicas
};
