const { getConnection, sql } = require('../db');
const { enviarRecordatorioTurno, enviarAgendaMedico } = require('./emailSender');
const { mensajeriaConfigurada, esErrorDefinitivo } = require('./mensajeria');
const { diaArgentino, horaArgentina } = require('./horaArgentina');

// Hora (argentina) en la que cada médico recibe la agenda del día siguiente
const HORA_AGENDA = 20;

const emailValido = (email) => Boolean(email && email.includes('@'));

const procesarRecordatoriosPacientes = async () => {
    if (!mensajeriaConfigurada()) return;
    try {
        const pool = await getConnection();
        const manana = diaArgentino(1);

        // Turnos de mañana (día argentino) que no se notificaron aún
        const pendientes = await pool.request()
            .input('desde', sql.DateTime, manana.desde)
            .input('hasta', sql.DateTime, manana.hasta)
            .query(`
                SELECT
                    t.id, t.fecha_hora_inicio,
                    p.nombre AS paciente_nombre, p.apellido AS paciente_apellido, p.email AS paciente_email,
                    pr.nombre AS profesional_nombre, pr.apellido AS profesional_apellido, pr.sexo AS profesional_sexo
                FROM Turnos t
                INNER JOIN Pacientes p ON t.paciente_id = p.id
                INNER JOIN Profesionales pr ON t.profesional_id = pr.id
                WHERE t.estado != 'Cancelado'
                  AND t.recordatorio_dia_anterior_enviado = 0
                  AND t.fecha_hora_inicio >= @desde AND t.fecha_hora_inicio < @hasta
            `);

        for (const turno of pendientes.recordset) {
            let marcar = true;
            if (emailValido(turno.paciente_email)) {
                try {
                    await enviarRecordatorioTurno({
                        turnoId: turno.id,
                        inicio: turno.fecha_hora_inicio,
                        pacienteNombre: `${turno.paciente_nombre} ${turno.paciente_apellido}`,
                        pacienteEmail: turno.paciente_email,
                        profesionalNombre: `${turno.profesional_nombre} ${turno.profesional_apellido}`,
                        profesionalSexo: turno.profesional_sexo,
                        claveUnica: `turno-recordatorio-${turno.id}-${new Date(turno.fecha_hora_inicio).toISOString()}`
                    });
                    console.log(`📧 Recordatorio encolado para el turno ID ${turno.id}`);
                } catch (err) {
                    // Error definitivo (mail inválido, baja, límite): no reintentar. Si no, se reintenta en la próxima vuelta.
                    marcar = esErrorDefinitivo(err);
                    console.error(`❌ Recordatorio del turno ID ${turno.id} no enviado: ${err.message}`);
                }
            }
            // Sin mail válido también se marca, para no revisarlo en cada vuelta
            if (marcar) {
                await pool.request()
                    .input('id', sql.Int, turno.id)
                    .query('UPDATE Turnos SET recordatorio_dia_anterior_enviado = 1, recordatorio_enviado = 1 WHERE id = @id');
            }
        }
    } catch (err) {
        console.error('🚨 Error en procesarRecordatoriosPacientes:', err.message);
    }
};

const procesarAgendasMedicas = async () => {
    if (!mensajeriaConfigurada() || horaArgentina() !== HORA_AGENDA) return;

    try {
        const pool = await getConnection();
        const manana = diaArgentino(1);

        // Profesionales con turnos mañana, con usuario activo y sin agenda enviada para esa fecha
        const resultProfesionales = await pool.request()
            .input('desde', sql.DateTime, manana.desde)
            .input('hasta', sql.DateTime, manana.hasta)
            .input('fecha', sql.Date, manana.fecha)
            .query(`
                SELECT DISTINCT
                    pr.id AS profesional_id, pr.nombre AS profesional_nombre, pr.apellido AS profesional_apellido,
                    pr.sexo AS profesional_sexo, u.email AS profesional_email
                FROM Turnos t
                INNER JOIN Profesionales pr ON t.profesional_id = pr.id
                INNER JOIN Usuarios u ON pr.usuario_id = u.id
                WHERE t.estado != 'Cancelado'
                  AND t.fecha_hora_inicio >= @desde AND t.fecha_hora_inicio < @hasta
                  AND u.activo = 1
                  AND pr.id NOT IN (SELECT profesional_id FROM envios_agenda_medico WHERE fecha_agenda = @fecha)
            `);

        for (const prof of resultProfesionales.recordset) {
            if (!emailValido(prof.profesional_email)) continue;
            try {
                const resultTurnos = await pool.request()
                    .input('profesional_id', sql.Int, prof.profesional_id)
                    .input('desde', sql.DateTime, manana.desde)
                    .input('hasta', sql.DateTime, manana.hasta)
                    .query(`
                        SELECT
                            t.fecha_hora_inicio, t.fecha_hora_fin, t.estado, t.motivo_consulta,
                            p.nombre AS paciente_nombre, p.apellido AS paciente_apellido
                        FROM Turnos t
                        INNER JOIN Pacientes p ON t.paciente_id = p.id
                        WHERE t.profesional_id = @profesional_id
                          AND t.estado != 'Cancelado'
                          AND t.fecha_hora_inicio >= @desde AND t.fecha_hora_inicio < @hasta
                        ORDER BY t.fecha_hora_inicio ASC
                    `);
                if (resultTurnos.recordset.length === 0) continue;

                let registrar = true;
                try {
                    await enviarAgendaMedico({
                        profesionalId: prof.profesional_id,
                        profesionalNombre: `${prof.profesional_nombre} ${prof.profesional_apellido}`,
                        profesionalSexo: prof.profesional_sexo,
                        profesionalEmail: prof.profesional_email,
                        dia: manana,
                        turnos: resultTurnos.recordset
                    });
                    console.log(`📧 Agenda de mañana encolada para el profesional ID ${prof.profesional_id}`);
                } catch (err) {
                    registrar = esErrorDefinitivo(err);
                    console.error(`❌ Agenda del profesional ID ${prof.profesional_id} no enviada: ${err.message}`);
                }

                if (registrar) {
                    await pool.request()
                        .input('profesional_id', sql.Int, prof.profesional_id)
                        .input('fecha_agenda', sql.Date, manana.fecha)
                        .query(`
                            INSERT INTO envios_agenda_medico (profesional_id, fecha_agenda, fecha_envio)
                            VALUES (@profesional_id, @fecha_agenda, GETDATE())
                        `);
                }
            } catch (err) {
                console.error(`❌ Error al armar la agenda del profesional ID ${prof.profesional_id}:`, err.message);
            }
        }
    } catch (err) {
        console.error('🚨 Error en procesarAgendasMedicas:', err.message);
    }
};

const iniciarScheduler = () => {
    if (!mensajeriaConfigurada()) {
        console.warn('⏰ Mensajería no configurada (MENSAJERIA_URL / MENSAJERIA_CLAVE): no se envían recordatorios ni agendas.');
    } else {
        console.log(`⏰ Scheduler iniciado: recordatorios el día anterior y agenda a los médicos a las ${HORA_AGENDA} h (hora argentina).`);
    }

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
