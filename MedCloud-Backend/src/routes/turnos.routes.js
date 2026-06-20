const { Router } = require('express');
const { 
    getTurnos, 
    createTurno, 
    setTurno, 
    deleteTurno, 
    getHorarios, 
    registrarPagoTurno,
    enviarRecordatorioManual
} = require('../controllers/turnos.controllers');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = Router();

// Rutas Administrativas (Protegidas)
router.get('/turnos', verificarToken, getTurnos);
router.post('/turnos', verificarToken, createTurno);
router.put('/turnos/:id', verificarToken, setTurno);
router.delete('/turnos/:id', verificarToken, deleteTurno);
router.get('/horarios', verificarToken, getHorarios);
router.post('/turnos/:id/pagar', verificarToken, registrarPagoTurno);
router.post('/turnos/:id/enviar-email', verificarToken, enviarRecordatorioManual);

module.exports = router;