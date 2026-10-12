/* =========================================================================
   ARCHIVO: src/utils/roles.js
   DESCRIPCIÓN: Ayudas para evitar escalada de privilegios.
   Solo un ADMIN puede crear, modificar o borrar usuarios ADMIN o el rol ADMIN.
   ========================================================================= */

const ROL_ADMIN = 'ADMIN';

const esAdmin = (req) => (req.user?.rol || '').toUpperCase() === ROL_ADMIN;

// Devuelve el código (en mayúsculas) del rol con ese id, usando el SP existente sp_GetRoles
const codigoDeRol = async (pool, rolId) => {
    if (rolId === undefined || rolId === null || rolId === '') return null;
    const roles = (await pool.request().execute('sp_GetRoles')).recordset;
    const rol = roles.find(r => r.id === parseInt(rolId, 10));
    return rol ? (rol.codigo || '').toUpperCase() : null;
};

const SIN_PERMISO_ADMIN = { message: 'Solo un administrador puede gestionar usuarios o roles de administrador.' };

module.exports = { ROL_ADMIN, esAdmin, codigoDeRol, SIN_PERMISO_ADMIN };
