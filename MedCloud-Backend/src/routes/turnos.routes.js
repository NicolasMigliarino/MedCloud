const { Router } = require('express');
const { 
    getTurnos, 
    createTurno, 
    setTurno, 
    deleteTurno, 
    getHorarios, 
    registrarPagoTurno,
    registrarPagoMultiplesTurnos,
    enviarRecordatorioManual
} = require('../controllers/turnos.controllers');
const { verificarToken, negarRoles } = require('../middlewares/auth.middleware');
const { upload } = require('../controllers/archivos.controllers');

const router = Router();

// Acciones que la agenda oculta al MEDICO: agendar, cobrar y enviar recordatorios
const sinMedico = [verificarToken, negarRoles('MEDICO')];

// Rutas Administrativas (Protegidas)
router.get('/turnos', verificarToken, getTurnos);
router.post('/turnos', sinMedico, createTurno);
router.put('/turnos/:id', verificarToken, setTurno);
router.delete('/turnos/:id', verificarToken, deleteTurno);
router.get('/horarios', verificarToken, getHorarios);
router.post('/turnos/:id/pagar', sinMedico, upload.single('comprobante'), registrarPagoTurno);
router.post('/turnos/pagar-multiples', sinMedico, upload.single('comprobante'), registrarPagoMultiplesTurnos);
router.post('/turnos/:id/enviar-email', sinMedico, enviarRecordatorioManual);

module.exports = router;