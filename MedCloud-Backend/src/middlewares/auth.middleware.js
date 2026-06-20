const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar la validez del token JWT enviado por el frontend.
 * También realiza la validación centralizada del estado de prueba (Trial) para evitar mutaciones de datos.
 */
const verificarToken = (req, res, next) => {
    // Buscamos el token que manda React en el header de Authorization
    const tokenHeader = req.headers['authorization'];
    
    if (!tokenHeader) {
        return res.status(403).json({ message: 'Acceso denegado. No hay token.' });
    }

    // Limpiamos el formato (separa la palabra "Bearer " del token real)
    const token = tokenHeader.split(' ')[1] || tokenHeader;

    // Verificamos que sea el mismo token que generó el Login
    jwt.verify(token, 'PALABRA_SECRETA_SUPER_SEGURA', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }
        
        // Guardamos los datos decodificados del usuario en la request (req.user) para uso de roles y auditoría
        req.user = decoded; 
        
        // ── VALIDACIÓN DEL TRIAL EXPIRADO CENTRALIZADA ─────────────────────────
        // Bloquea cualquier operación de escritura (POST, PUT, DELETE) si el trial venció (< 0).
        // De esta manera protegemos toda la base de datos de modificaciones sin interrumpir las consultas (GET).
        if (req.method !== 'GET') {
            const { trial_dias_restantes } = decoded;
            if (trial_dias_restantes !== undefined && trial_dias_restantes < 0) {
                return res.status(403).json({ 
                    message: 'El periodo de prueba ha expirado. Por favor, contacte a soporte para activar su licencia.',
                    code: 'TRIAL_EXPIRED'
                });
            }
        }
        
        next(); // Token válido y trial activo, procedemos al controlador correspondiente
    });
};

module.exports = { verificarToken };
