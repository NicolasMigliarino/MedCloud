const { Router } = require('express');
const {
    getCajaActiva,
    abrirCaja,
    cerrarCaja,
    getHistorialCajas,
    getLiquidacion
} = require('../controllers/caja.controllers');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

const router = Router();

// Caja y liquidaciones: mismas restricciones que la pantalla (ADMIN y RECEPCION)
const gestionCaja = [verificarToken, permitirRoles('ADMIN', 'RECEPCION')];

// Rutas de Control de Caja Diaria
router.get('/caja/activa', gestionCaja, getCajaActiva);
router.post('/caja/abrir', gestionCaja, abrirCaja);
router.post('/caja/cerrar', gestionCaja, cerrarCaja);
router.get('/caja/historial', gestionCaja, getHistorialCajas);

// Ruta de Liquidaciones de Honorarios
router.get('/liquidaciones', gestionCaja, getLiquidacion);

module.exports = router;
