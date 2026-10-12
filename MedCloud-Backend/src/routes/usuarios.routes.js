const { Router } = require('express');
const { getUsuarios, getUsuarioById, createUsuario, deleteUsuario, setUsuario, changePassword } = require('../controllers/usuarios.controllers');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');
const router = Router();

// Gestión de usuarios: mismas restricciones que la pantalla (ADMIN y RECEPCION)
const gestionUsuarios = [verificarToken, permitirRoles('ADMIN', 'RECEPCION')];

router.get('/usuarios', gestionUsuarios, getUsuarios);
router.get('/usuarios/:id', gestionUsuarios, getUsuarioById);
router.post('/usuarios', gestionUsuarios, createUsuario);
router.put('/usuarios/:id', gestionUsuarios, setUsuario);
router.delete('/usuarios/:id', gestionUsuarios, deleteUsuario);

// Cambio de la propia contraseña (ej: 1er login). El controlador valida que sea el mismo usuario o un ADMIN.
router.put('/usuarios/:id/password', verificarToken, changePassword);

module.exports = router;
