/* =========================================================================
   ARCHIVO: src/utils/enlacesTurno.js
   DESCRIPCIÓN: Links firmados para que el paciente confirme o cancele su turno desde el mail.
   El código lleva el turno, la acción y el vencimiento (el inicio del turno), firmado con HMAC:
   no se puede adivinar ni cambiar para otro turno. No lleva datos del paciente.
   ========================================================================= */
const crypto = require('crypto');
const { JWT_SECRET } = require('../config');

// Clave propia de estos links, derivada del secreto de sesión (no sirve para firmar sesiones)
const CLAVE = crypto.createHmac('sha256', JWT_SECRET).update('medcloud:enlaces-turno').digest();
const ACCIONES = ['confirmar', 'cancelar'];

const firmarDatos = (datos) => crypto.createHmac('sha256', CLAVE).update(datos).digest();

const firmar = (turnoId, accion, vence) => {
    const datos = Buffer.from(JSON.stringify({
        t: turnoId,
        a: accion,
        v: Math.floor(new Date(vence).getTime() / 1000)
    })).toString('base64url');
    return `${datos}.${firmarDatos(datos).toString('base64url')}`;
};

// Devuelve { turnoId, accion, vencido } o null si el código no es válido
const verificar = (token) => {
    if (typeof token !== 'string' || token.length > 300) return null;
    const [datos, firma] = token.split('.');
    if (!datos || !firma) return null;

    const esperada = firmarDatos(datos);
    const recibida = Buffer.from(firma, 'base64url');
    if (recibida.length !== esperada.length || !crypto.timingSafeEqual(recibida, esperada)) return null;

    try {
        const { t, a, v } = JSON.parse(Buffer.from(datos, 'base64url').toString('utf8'));
        if (!Number.isInteger(t) || !ACCIONES.includes(a) || !Number.isInteger(v)) return null;
        return { turnoId: t, accion: a, vencido: Date.now() / 1000 > v };
    } catch {
        return null;
    }
};

const enlaceTurno = (turnoId, accion, vence) => {
    const base = (process.env.BACKEND_URL || 'http://localhost:3000').replace(/\/+$/, '');
    return `${base}/turnos/respuesta?t=${firmar(turnoId, accion, vence)}`;
};

module.exports = { firmar, verificar, enlaceTurno };
