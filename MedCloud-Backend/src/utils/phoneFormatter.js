/**
 * Normaliza un número de teléfono para que se almacene con el formato internacional 549...
 * Elimina cualquier caracter no numérico y formatea los números locales.
 *
 * @param {string} telefono - El teléfono ingresado por el usuario
 * @returns {string|null} - Teléfono formateado como "549XXXXXXXXXX" o null si está vacío
 */
function formatTelefonoAR(telefono) {
    if (!telefono) return null;

    // 1. Limpiar todos los caracteres no numéricos (espacios, guiones, símbolos, etc.)
    let limpio = telefono.replace(/\D/g, '');

    if (!limpio) return null;

    // 2. Si ya empieza con 549 y tiene un largo estándar de celular (12 o 13 dígitos)
    if (limpio.startsWith('549') && (limpio.length === 12 || limpio.length === 13)) {
        return limpio;
    }

    // 3. Si empieza con 54 pero le falta el 9 de móvil (largo 11 o 12 dígitos, ej: 54 11 1234 5678)
    if (limpio.startsWith('54') && limpio.length === 12) {
        return '549' + limpio.substring(2);
    }
    if (limpio.startsWith('54') && limpio.length === 11) {
        return '549' + limpio.substring(2);
    }

    // 4. Si ingresó un número local de 10 dígitos (ej: 11 1234 5678 o 11 15 1234 5678 sin el 15)
    // Como el front muestra el prefijo visual estático '+54 9', los usuarios ingresarán el formato local.
    // Ej: "11 1234 5678" -> limpio: "1112345678" (10 dígitos). Prependemos 549.
    if (limpio.length === 10) {
        return '549' + limpio;
    }

    // 5. Si tiene el "15" local de celulares (ej: 11 15 1234 5678 -> limpio: "111512345678" (12 dígitos))
    // El "15" se debe remover para el formato internacional de WhatsApp.
    if (limpio.length === 12 && limpio.substring(2, 4) === '15') {
        return '549' + limpio.substring(0, 2) + limpio.substring(4);
    }

    // 6. Si empieza con 0 (ej: 011 1234 5678 o 011 15 1234 5678)
    if (limpio.startsWith('0')) {
        return formatTelefonoAR(limpio.substring(1));
    }

    // 7. Si tiene 8 dígitos (por ejemplo, número de CABA sin prefijo de área '11')
    if (limpio.length === 8) {
        return '54911' + limpio;
    }

    // Caso por defecto: si no empieza con 549, le anteponemos el prefijo de país para Argentina
    if (!limpio.startsWith('549')) {
        // Si por casualidad empieza con 54, nos aseguramos que tenga el 9 de celular
        if (limpio.startsWith('54')) {
            return '549' + limpio.substring(2);
        }
        return '549' + limpio;
    }

    return limpio;
}

module.exports = { formatTelefonoAR };
