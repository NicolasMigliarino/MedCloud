const { Router } = require('express');
const { 
    getCajaActiva, 
    abrirCaja, 
    cerrarCaja, 
    getHistorialCajas, 
    getLiquidacion 
} = require('../controllers/caja.controllers');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = Router();

// Rutas de Control de Caja Diaria (Acceso para RECEPCION y ADMIN)
router.get('/caja/activa', verificarToken, getCajaActiva);
router.post('/caja/abrir', verificarToken, abrirCaja);
router.post('/caja/cerrar', verificarToken, cerrarCaja);
router.get('/caja/historial', verificarToken, getHistorialCajas);

// Ruta de Liquidaciones de Honorarios (Acceso para RECEPCION y ADMIN)
router.get('/liquidaciones', verificarToken, getLiquidacion);

module.exports = router;
