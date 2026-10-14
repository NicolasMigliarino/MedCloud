/* =========================================================================
   ARCHIVO: src/utils/mensajeria.js
   DESCRIPCIÓN: Cliente del servicio de mensajería de MuchoCodigo (e-mails por Resend).
   Los textos viven en las plantillas medcloud/* del servicio; acá solo se arma el pedido.
   Configuración: MENSAJERIA_URL y MENSAJERIA_CLAVE (clave del cliente, nunca en el código).
   ========================================================================= */

const mensajeriaConfigurada = () => Boolean(process.env.MENSAJERIA_URL && process.env.MENSAJERIA_CLAVE);

// Encola un mensaje. Devuelve { id, estado, duplicado }. Ante un error lanza uno con .status
// (400 datos inválidos, 409 destinatario dado de baja o límite mensual, 503 servicio no disponible).
const enviarMensaje = async ({ plantilla, para, datos, claveUnica }) => {
    if (!mensajeriaConfigurada()) {
        const err = new Error('La mensajería no está configurada (MENSAJERIA_URL / MENSAJERIA_CLAVE).');
        err.status = 503;
        throw err;
    }

    let res;
    try {
        res = await fetch(`${process.env.MENSAJERIA_URL.replace(/\/+$/, '')}/v1/mensajes`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${process.env.MENSAJERIA_CLAVE}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ plantilla, para, datos, claveUnica }),
            signal: AbortSignal.timeout(10000)
        });
    } catch (causa) {
        const err = new Error(`No se pudo conectar con la mensajería: ${causa.message}`);
        err.status = 503;
        throw err;
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const err = new Error(data.error || `La mensajería respondió ${res.status}`);
        err.status = res.status;
        throw err;
    }
    return data;
};

// Error que no se arregla reintentando (dato inválido, destinatario dado de baja, límite del mes)
const esErrorDefinitivo = (err) => err.status === 400 || err.status === 409;

module.exports = { enviarMensaje, mensajeriaConfigurada, esErrorDefinitivo };
