const { Router } = require('express');
const { verificarToken, permitirRoles, negarRoles } = require('../middlewares/auth.middleware');
const { upload } = require('../controllers/archivos.controllers');
const {
    getHistorialPagosPaciente,
    getHistorialPagosProfesional,
    registrarPagoProfesional
} = require('../controllers/pagos.controllers');

const router = Router();

// Historial de pagos de pacientes (el listado de pacientes lo oculta al MEDICO)
router.get('/pagos/paciente/:id', verificarToken, negarRoles('MEDICO'), getHistorialPagosPaciente);

// Liquidaciones a profesionales: misma restricción que la pantalla (ADMIN y RECEPCION)
const gestionLiquidaciones = [verificarToken, permitirRoles('ADMIN', 'RECEPCION')];

// Historial de liquidaciones pagadas a profesionales
router.get('/pagos/profesional/:id', gestionLiquidaciones, getHistorialPagosProfesional);

// Registrar pago de liquidación a profesional (con comprobante)
router.post('/pagos/profesional/:id', gestionLiquidaciones, upload.single('comprobante'), registrarPagoProfesional);

module.exports = router;
