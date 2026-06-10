const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
    }
});

const buildReminderEmailHTML = (pacienteNombre, profesionalNombre, especialidad, fechaHora) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; background-color:#f0f2f5; font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5; padding:40px 0;">
            <tr>
                <td align="center">
                    <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.08); overflow:hidden;">
                        <!-- Header con gradiente -->
                        <tr>
                            <td style="background:linear-gradient(135deg,#1e3c72,#2a5298); padding:32px 40px; text-align:center;">
                                <h1 style="color:#ffffff; margin:0; font-size:28px; font-weight:700; letter-spacing:-0.5px;">MedicApp</h1>
                                <p style="color:rgba(255,255,255,0.85); margin:8px 0 0; font-size:14px;">Recordatorio de Turno Médico</p>
                            </td>
                        </tr>
                        <!-- Cuerpo del email -->
                        <tr>
                            <td style="padding:36px 40px;">
                                <h2 style="color:#1a1a2e; margin:0 0 16px; font-size:20px;">¡Hola, ${pacienteNombre}!</h2>
                                <p style="color:#64748b; margin:0 0 24px; font-size:14px; line-height:1.6;">
                                    Te recordamos que tenés un turno programado en nuestra clínica. A continuación, te detallamos la información de tu cita:
                                </p>
                                
                                <!-- Detalles del Turno -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:24px; padding:16px;">
                                    <tr>
                                        <td style="padding: 6px 0; font-size:14px; color:#475569;"><strong>Profesional:</strong></td>
                                        <td style="padding: 6px 0; font-size:14px; color:#1e293b; text-align:right;">Dr. ${profesionalNombre}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; font-size:14px; color:#475569;"><strong>Especialidad:</strong></td>
                                        <td style="padding: 6px 0; font-size:14px; color:#1e293b; text-align:right;">${especialidad || 'General'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; font-size:14px; color:#475569;"><strong>Fecha y Hora:</strong></td>
                                        <td style="padding: 6px 0; font-size:14px; color:#1e293b; text-align:right;">${fechaHora} hs</td>
                                    </tr>
                                </table>
                                
                                <!-- Alerta de Inasistencia (Política de la clínica) -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff1f2; border:1px solid #fecdd3; border-radius:12px; margin-bottom:24px; padding:16px;">
                                    <tr>
                                        <td>
                                            <p style="color:#9f1239; font-size:13.5px; line-height:1.6; margin:0; font-weight:700; text-align:center;">
                                                ⚠️ IMPORTANTE: Política de Asistencia
                                            </p>
                                            <p style="color:#be123c; font-size:12.5px; line-height:1.5; margin:6px 0 0 0; text-align:center;">
                                                En caso de no asistir al turno programado, <strong>la consulta deberá ser abonada de todas formas</strong>.
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <p style="color:#64748b; margin:0; font-size:13.5px; line-height:1.5; text-align:center;">
                                    Te sugerimos asistir 10 minutos antes del horario indicado. ¡Te esperamos!
                                </p>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="background-color:#f8fafc; padding:20px 40px; border-top:1px solid #e2e8f0; text-align:center;">
                                <p style="color:#94a3b8; font-size:11px; margin:0;">
                                    © ${new Date().getFullYear()} MedicApp — Plataforma de Gestión Clínica Integral
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`;
};

const sendPatientReminderEmail = async (pacienteNombre, pacienteEmail, profesionalNombre, especialidad, fechaHora) => {
    const mailOptions = {
        from: `"MedicApp" <${process.env.SMTP_USER || 'noreply@medicapp.com'}>`,
        to: pacienteEmail,
        subject: '📅 MedicApp — Recordatorio de Turno Médico',
        html: buildReminderEmailHTML(pacienteNombre, profesionalNombre, especialidad, fechaHora)
    };

    return transporter.sendMail(mailOptions);
};

const buildDoctorAgendaEmailHTML = (profesionalNombre, fechaLegible, turnosRowsHTML, totalTurnos) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; background-color:#f0f2f5; font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5; padding:40px 0;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.08); overflow:hidden;">
                        <!-- Header con gradiente corporativo -->
                        <tr>
                            <td style="background:linear-gradient(135deg,#1e3c72,#2a5298); padding:32px 40px; text-align:center;">
                                <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700; letter-spacing:-0.5px;">Resumen de Agenda Médica</h1>
                                <p style="color:rgba(255,255,255,0.85); margin:8px 0 0; font-size:14px;">${fechaLegible}</p>
                            </td>
                        </tr>
                        <!-- Cuerpo del email -->
                        <tr>
                            <td style="padding:36px 40px;">
                                <h2 style="color:#1a1a2e; margin:0 0 12px; font-size:18px;">Estimado/a Dr/a. ${profesionalNombre},</h2>
                                <p style="color:#64748b; margin:0 0 24px; font-size:14px; line-height:1.6;">
                                    Le enviamos el consolidado de turnos programados para el día de mañana. En total cuenta con <strong>${totalTurnos} pacientes</strong> agendados:
                                </p>
                                
                                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-top: 16px;">
                                    <thead>
                                        <tr style="border-bottom: 2px solid #cbd5e1; background-color: #f8fafc; text-align: left;">
                                            <th style="padding: 10px 8px; font-size: 13px; color: #475569; font-weight: 600;">Horario</th>
                                            <th style="padding: 10px 8px; font-size: 13px; color: #475569; font-weight: 600;">Paciente</th>
                                            <th style="padding: 10px 8px; font-size: 13px; color: #475569; font-weight: 600;">Estado</th>
                                            <th style="padding: 10px 8px; font-size: 13px; color: #475569; font-weight: 600;">Motivo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${turnosRowsHTML}
                                    </tbody>
                                </table>
                                
                                <p style="margin-top: 28px; font-size: 13px; color: #94a3b8; text-align: center;">Este es un envío automático generado por MedicApp.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`;
};

const sendDoctorAgendaEmail = async (profesionalNombre, profesionalEmail, fechaLegible, turnosRowsHTML, totalTurnos) => {
    const mailOptions = {
        from: `"MedicApp" <${process.env.SMTP_USER || 'noreply@medicapp.com'}>`,
        to: profesionalEmail,
        subject: `📋 Agenda Médica para Mañana — MedicApp`,
        html: buildDoctorAgendaEmailHTML(profesionalNombre, fechaLegible, turnosRowsHTML, totalTurnos)
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { 
    sendPatientReminderEmail,
    sendDoctorAgendaEmail
};
