/* =========================================================================
   ARCHIVO: src/utils/horaArgentina.js
   DESCRIPCIÓN: Fechas y horas siempre en hora argentina, sin depender de la zona del servidor.
   Las fechas de la base son instantes (el driver mssql las lee como UTC). Argentina no usa horario
   de verano: el día argentino va de las 03:00 a las 03:00 UTC.
   ========================================================================= */

const ZONA = 'America/Argentina/Buenos_Aires';

const formatoFecha = (fecha, opciones = {}) => new Date(fecha).toLocaleDateString('es-AR', { timeZone: ZONA, ...opciones });

const formatoHora = (fecha) => new Date(fecha).toLocaleTimeString('es-AR', { timeZone: ZONA, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

const formatoFechaHora = (fecha) => new Date(fecha).toLocaleString('es-AR', { timeZone: ZONA, hourCycle: 'h23' });

const partesAhora = () => Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' })
        .formatToParts(new Date())
        .map(p => [p.type, p.value])
);

// Día argentino (hoy + dias) como rango de instantes [desde, hasta) y su fecha AAAA-MM-DD
const diaArgentino = (dias = 0) => {
    const p = partesAhora();
    const desde = new Date(Date.UTC(+p.year, +p.month - 1, +p.day + dias, 3, 0, 0));
    const hasta = new Date(desde.getTime() + 24 * 60 * 60 * 1000);
    const fecha = new Date(Date.UTC(+p.year, +p.month - 1, +p.day + dias)).toISOString().slice(0, 10);
    return { desde, hasta, fecha };
};

const horaArgentina = () => +partesAhora().hour;

module.exports = { ZONA, formatoFecha, formatoHora, formatoFechaHora, diaArgentino, horaArgentina };
