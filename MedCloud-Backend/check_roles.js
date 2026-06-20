const { getConnection } = require('./src/db');

async function run() {
    const pool = await getConnection();
    if (!pool) {
        console.error("No se pudo conectar a la base de datos");
        return;
    }
    try {
        const result = await pool.request().query(`
            SELECT u.username, r.codigo, r.nombre 
            FROM usuarios u
            INNER JOIN roles r ON u.rol_id = r.id
            WHERE u.username IN ('doctor_nico', 'admin_general', 'Yanina')
        `);
        console.log("=== DATOS DE USUARIOS Y ROLES EN LA BD ===");
        console.log(result.recordset);
    } catch (e) {
        console.error("Error al consultar:", e);
    } finally {
        await pool.close();
    }
}

run();
