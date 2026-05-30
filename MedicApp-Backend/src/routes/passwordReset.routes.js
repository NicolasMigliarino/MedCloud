// ============================================================================
// Rutas de Recuperación de Contraseña por Email
// NOTA: Estas rutas son PÚBLICAS (sin verificarToken) porque el usuario
//       no está autenticado cuando necesita recuperar su contraseña.
// ============================================================================

const { Router } = require('express');
const { forgotPassword, validateResetToken, resetPassword } = require('../controllers/passwordReset.controllers');

const router = Router();

// Solicitar recuperación de contraseña (envía email con link)
router.post('/auth/forgot-password', forgotPassword);

// Validar si un token de reset es válido (antes de mostrar el formulario)
router.post('/auth/validate-reset-token', validateResetToken);

// Ejecutar el cambio de contraseña con el token
router.post('/auth/reset-password', resetPassword);

module.exports = router;
