const { Router } = require('express');
const { getAdministrativos, createAdministrativo, deleteAdministrativo, setAdministrativo } = require('../controllers/administrativos.controllers');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');
const router = Router();

// Ninguna pantalla usa estas rutas hoy: quedan reservadas al ADMIN
const soloAdmin = [verificarToken, permitirRoles('ADMIN')];

router.get('/administrativos', soloAdmin, getAdministrativos);
router.post('/administrativos', soloAdmin, createAdministrativo);
router.put('/administrativos/:id', soloAdmin, setAdministrativo);
router.delete('/administrativos/:id', soloAdmin, deleteAdministrativo);

module.exports = router;
