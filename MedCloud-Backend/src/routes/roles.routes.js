const { Router } = require('express');
const { getRoles, createRol, deleteRol, setRol } = require('../controllers/roles.controllers');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');
const router = Router();

// Gestión de roles: mismas restricciones que la pantalla (ADMIN y RECEPCION)
const gestionRoles = [verificarToken, permitirRoles('ADMIN', 'RECEPCION')];

router.get('/roles', gestionRoles, getRoles);
router.post('/roles', gestionRoles, createRol);
router.put('/roles/:id', gestionRoles, setRol);
router.delete('/roles/:id', gestionRoles, deleteRol);

module.exports = router;
