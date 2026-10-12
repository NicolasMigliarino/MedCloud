/* =========================================================================
   ARCHIVO: src/config.js
   DESCRIPCIÓN: Configuración sensible leída del entorno (.env).
   Nunca se escriben secretos en el código: si falta uno, el servidor no arranca.
   ========================================================================= */
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
    console.error('🚨 Falta JWT_SECRET en el .env (mínimo 32 caracteres). Ver .env.example.');
    process.exit(1);
}

module.exports = { JWT_SECRET };
