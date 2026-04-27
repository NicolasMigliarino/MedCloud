const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // Buscamos el token que manda React
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
        
        // ¡LA MAGIA! Guardamos los datos del usuario para usarlos después
        req.user = decoded; 
        
        next(); // Lo dejamos pasar
    });
};

module.exports = { verificarToken };
