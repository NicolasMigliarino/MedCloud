/* =========================================================================
   ARCHIVO: src/utils/emailSender.js
   DESCRIPCIÓN: Mails de MedCloud por la mensajería de MuchoCodigo (plantillas medcloud/*).
   Datos de salud: al paciente solo fecha, hora y profesional. La agenda del médico incluye
   el motivo de consulta (decisión del responsable de MedCloud).
   ========================================================================= */
const { enviarMensaje } = require('./mensajeria');
const { enlaceTurno } = require('./enlacesTurno');
const { formatoFecha, formatoHora, formatoFechaHora } = require('./horaArgentina');

// La plantilla admite hasta 4.000 caracteres por dato: la agenda se recorta antes
const MAX_AGENDA = 3800;

const tratamiento = (sexo) => (sexo === 'Femenino' ? 'Dra. ' : sexo === 'Masculino' ? 'Dr. ' : '');

// Recordatorio al paciente con links firmados para confirmar o cancelar (vencen al empezar el turno)
const enviarRecordatorioTurno = ({ turnoId, inicio, pacienteNombre, pacienteEmail, profesionalNombre, profesionalSexo, claveUnica }) =>
    enviarMensaje({
        plantilla: 'recordatorio-turno',
        para: { email: pacienteEmail, nombre: pacienteNombre },
        datos: {
            fecha: formatoFecha(inicio, { weekday: 'long', day: 'numeric', month: 'long' }),
            hora: formatoHora(inicio),
            profesional: `${tratamiento(profesionalSexo)}${profesionalNombre}`,
            enlace_confirmar: enlaceTurno(turnoId, 'confirmar', inicio),
            enlace_cancelar: enlaceTurno(turnoId, 'cancelar', inicio)
        },
        claveUnica
    });

// Agenda del día siguiente para el médico: un renglón por turno (hora, paciente, estado, motivo)
const enviarAgendaMedico = ({ profesionalId, profesionalNombre, profesionalSexo, profesionalEmail, dia, turnos }) => {
    const renglones = turnos.map(t => [
        `${formatoHora(t.fecha_hora_inicio)} a ${formatoHora(t.fecha_hora_fin)}`,
        `${t.paciente_nombre} ${t.paciente_apellido}`,
        (t.estado || '').toLowerCase() === 'confirmado' ? 'Confirmado' : 'Sin confirmar',
        t.motivo_consulta || 'Sin motivo cargado'
    ].join(' · '));

    let agenda = '';
    let incluidos = 0;
    for (const renglon of renglones) {
        if (agenda.length + renglon.length + 60 > MAX_AGENDA) break;
        agenda += (agenda ? '\n' : '') + renglon;
        incluidos += 1;
    }
    if (incluidos < renglones.length) agenda += `\n… y ${renglones.length - incluidos} turnos más (ver MedCloud)`;

    const confirmados = turnos.filter(t => (t.estado || '').toLowerCase() === 'confirmado').length;

    return enviarMensaje({
        plantilla: 'agenda-medico',
        para: { email: profesionalEmail, nombre: `${tratamiento(profesionalSexo)}${profesionalNombre}` },
        datos: {
            fecha: formatoFecha(dia.desde, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
            total: String(turnos.length),
            confirmados: String(confirmados),
            pendientes: String(turnos.length - confirmados),
            agenda
        },
        claveUnica: `agenda-${profesionalId}-${dia.fecha}`
    });
};

// Link de recuperación de contraseña (de un solo uso)
const enviarRecuperarClave = ({ email, usuario, enlace, minutos }) =>
    enviarMensaje({
        plantilla: 'recuperar-clave',
        para: { email, nombre: usuario },
        datos: { usuario, enlace, minutos: String(minutos) }
    });

// Pedido de soporte: va a la casilla configurada en SOPORTE_EMAIL
const enviarSoporte = ({ usuario, rol, categoria, asunto, descripcion, contacto }) => {
    if (!process.env.SOPORTE_EMAIL) {
        const err = new Error('Falta SOPORTE_EMAIL en la configuración.');
        err.status = 503;
        throw err;
    }
    return enviarMensaje({
        plantilla: 'soporte',
        para: { email: process.env.SOPORTE_EMAIL, nombre: 'Soporte MedCloud' },
        datos: { usuario, rol, fecha: formatoFechaHora(new Date()), categoria, asunto, descripcion, contacto }
    });
};

module.exports = { enviarRecordatorioTurno, enviarAgendaMedico, enviarRecuperarClave, enviarSoporte };
