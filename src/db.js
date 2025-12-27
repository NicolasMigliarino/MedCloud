/* =========================================================================
   ARCHIVO: src/db.js
   DESCRIPCIÓN: Conexión estándar con Usuario y Contraseña.
   Esta es la forma más compatible y estable.
   ========================================================================= */
const sql = require('mssql');

const dbSettings = {
    server: 'localhost', 
    database: 'MedicApp',
    user: 'medicapp_user',      // El usuario que acabamos de crear
    password: 'MedicApp123',    // La contraseña que pusimos en el script
    options: {
        encrypt: false, // Importante para SQL local
        trustServerCertificate: true // Confía en el certificado local
    }
};

async function getConnection() {
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch (error) {
        console.error('ERROR DE CONEXIÓN:', error);
    }
}

module.exports = { getConnection, sql };