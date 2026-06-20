require('dotenv').config();
const { getConnection, sql } = require('./src/db');
const { sendPatientReminderEmail, sendDoctorAgendaEmail } = require('./src/utils/emailSender');
const { procesarRecordatoriosPacientes } = require('./src/utils/scheduler');

async function main() {
    const args = process.argv.slice(2);
    const mode = args[0];

    try {
        const pool = await getConnection();
        
        // Calcular fecha de mañana
        const mañana = new Date();
        mañana.setDate(mañana.getDate() + 1);
        const mañanaFechaStr = mañana.toISOString().slice(0, 10);
        
        if (!mode || mode === '--list') {
            console.log(`\n======================================================`);
            console.log(`🔍 MedicApp - ESTADO DE TURNOS PARA MAÑANA (${mañanaFechaStr})`);
            console.log(`======================================================`);
            
            const resultTurnos = await pool.request()
                .input('mañana', sql.Date, mañanaFechaStr)
                .query(`
                    SELECT 
                        t.id, t.fecha_hora_inicio, t.estado, t.recordatorio_dia_anterior_enviado,
                        p.nombre AS paciente_nombre, p.apellido AS paciente_apellido, p.email AS paciente_email,
                        pr.id AS profesional_id, pr.nombre AS profesional_nombre, pr.apellido AS profesional_apellido,
                        u.email AS profesional_email
                    FROM Turnos t
                    INNER JOIN Pacientes p ON t.paciente_id = p.id
                    INNER JOIN Profesionales pr ON t.profesional_id = pr.id
                    LEFT JOIN Usuarios u ON pr.usuario_id = u.id
                    WHERE CAST(t.fecha_hora_inicio AS DATE) = @mañana
                `);

            const turnos = resultTurnos.recordset;
            if (turnos.length === 0) {
                console.log(`⚠️  No hay turnos agendados para mañana (${mañanaFechaStr}).`);
                console.log(`💡 Para probar, creá un turno en la base de datos o en la app web con fecha de mañana.`);
            } else {
                console.log(`Se encontraron ${turnos.length} turno(s) para mañana:`);
                turnos.forEach(t => {
                    console.log(`\n📌 Turno ID: ${t.id}`);
                    console.log(`   - Paciente: ${t.paciente_nombre} ${t.paciente_apellido} (${t.paciente_email || 'Sin email'})`);
                    console.log(`   - Profesional: Dr. ${t.profesional_nombre} ${t.profesional_apellido} (${t.profesional_email || 'Sin email/usuario'})`);
                    console.log(`   - Horario: ${new Date(t.fecha_hora_inicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs`);
                    console.log(`   - Estado: ${t.estado}`);
                    console.log(`   - ¿Notificación enviada?: ${t.recordatorio_dia_anterior_enviado ? 'Sí (1)' : 'No (0)'}`);
                });
            }
            
            console.log(`\n======================================================`);
            console.log(`💡 COMANDOS DISPONIBLES PARA PROBAR:`);
            console.log(`======================================================`);
            console.log(`- node test-notifs.js --list         : Muestra esta lista`);
            console.log(`- node test-notifs.js --run-pacientes : Ejecuta el recordatorio automático a pacientes de mañana`);
            console.log(`- node test-notifs.js --run-doctor    : Envía la agenda consolidada a todos los médicos que tienen turnos mañana`);
            console.log(`- node test-notifs.js --force-patient <email> : Envía un recordatorio de prueba a un email específico (sin validar fecha)`);
            console.log(`- node test-notifs.js --force-doctor <email>  : Envía una agenda médica de prueba a un email específico (sin validar fecha)`);
            console.log(`======================================================\n`);
            
            process.exit(0);
        }

        if (mode === '--run-pacientes') {
            console.log(`\n🚀 Ejecutando procesarRecordatoriosPacientes()...`);
            await procesarRecordatoriosPacientes();
            console.log(`✔️ Ejecución finalizada. Revisá la consola de arriba si hubo envíos.`);
            process.exit(0);
        }

        if (mode === '--run-doctor') {
            console.log(`\n🚀 Enviando agendas médicas para mañana (${mañanaFechaStr})...`);
            
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
                `);

            const profesionales = resultProfesionales.recordset;
            if (profesionales.length === 0) {
                console.log(`⚠️  No hay profesionales con turnos agendados para mañana (${mañanaFechaStr}).`);
                process.exit(0);
            }

            for (const prof of profesionales) {
                if (prof.profesional_email && prof.profesional_email.includes('@')) {
                    // Obtener todos los turnos del profesional para mañana
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
                    if (turnos.length === 0) continue;

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
                    
                    console.log(`📧 Enviando agenda al Dr. ${prof.profesional_apellido} (${prof.profesional_email})...`);
                    await sendDoctorAgendaEmail(
                        `${prof.profesional_nombre} ${prof.profesional_apellido}`,
                        prof.profesional_email,
                        fechaLegible,
                        agendaRowsHTML,
                        turnos.length
                    );
                    
                    // Registrar envío para evitar duplicados en el scheduler real
                    await pool.request()
                        .input('profesional_id', sql.Int, prof.profesional_id)
                        .input('fecha_agenda', sql.Date, mañanaFechaStr)
                        .query(`
                            IF NOT EXISTS (SELECT 1 FROM envios_agenda_medica WHERE profesional_id = @profesional_id AND fecha_agenda = @fecha_agenda)
                            BEGIN
                                INSERT INTO envios_agenda_medica (profesional_id, fecha_agenda, fecha_envio)
                                VALUES (@profesional_id, @fecha_agenda, GETDATE())
                            END
                        `);
                    
                    console.log(`✔️  Agenda enviada correctamente.`);
                } else {
                    console.log(`⚠️  El profesional Dr. ${prof.profesional_apellido} no tiene un email válido registrado (${prof.profesional_email}).`);
                }
            }
            process.exit(0);
        }

        if (mode === '--force-patient') {
            const testEmail = args[1];
            if (!testEmail || !testEmail.includes('@')) {
                console.log("❌ Error: Debés ingresar un email de destino. Ejemplo: node test-notifs.js --force-patient tu_email@gmail.com");
                process.exit(1);
            }
            
            console.log(`📧 Enviando recordatorio de paciente de prueba a: ${testEmail}...`);
            const fechaSimulada = new Date(mañana);
            fechaSimulada.setHours(10, 30);
            const fechaStr = fechaSimulada.toLocaleDateString('es-AR') + ' a las ' + fechaSimulada.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

            await sendPatientReminderEmail(
                "Juan Pérez (Prueba)",
                testEmail,
                "Leticia Gómez",
                "Pediatría",
                fechaStr
            );
            console.log("✔️  Email de recordatorio de paciente enviado con éxito.");
            process.exit(0);
        }

        if (mode === '--force-doctor') {
            const testEmail = args[1];
            if (!testEmail || !testEmail.includes('@')) {
                console.log("❌ Error: Debés ingresar un email de destino. Ejemplo: node test-notifs.js --force-doctor tu_email@gmail.com");
                process.exit(1);
            }

            console.log(`📧 Enviando agenda de médico de prueba a: ${testEmail}...`);
            const fechaLegible = mañana.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            
            const turnosHTMLPrueba = `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 12px 8px; font-size: 14px; color: #1e293b;"><strong>09:00 - 09:30 hs</strong></td>
                    <td style="padding: 12px 8px; font-size: 14px; color: #1e293b;">Juan Pérez</td>
                    <td style="padding: 12px 8px; font-size: 14px; color: #2563eb; font-weight: 600;">Confirmado</td>
                    <td style="padding: 12px 8px; font-size: 14px; color: #475569;">Control de rutina</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 12px 8px; font-size: 14px; color: #1e293b;"><strong>10:00 - 10:30 hs</strong></td>
                    <td style="padding: 12px 8px; font-size: 14px; color: #1e293b;">María Rodríguez</td>
                    <td style="padding: 12px 8px; font-size: 14px; color: #2563eb; font-weight: 600;">Pendiente</td>
                    <td style="padding: 12px 8px; font-size: 14px; color: #475569;">Consulta por dolor de garganta</td>
                </tr>
            `;

            await sendDoctorAgendaEmail(
                "Leticia Gómez (Prueba)",
                testEmail,
                fechaLegible,
                turnosHTMLPrueba,
                2
            );
            console.log("✔️  Email de agenda médica enviado con éxito.");
            process.exit(0);
        }

        console.log("❌ Argumento no válido. Usá --list para ver las opciones.");
        process.exit(1);

    } catch (error) {
        console.error("🚨 Error durante la prueba:", error.message);
        process.exit(1);
    }
}

main();
