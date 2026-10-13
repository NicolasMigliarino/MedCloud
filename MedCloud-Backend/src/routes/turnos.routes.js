const { Router } = require('express');
const {
    getTurnos,
    createTurno,
    setTurno,
    deleteTurno,
    getHorarios,
    registrarPagoTurno,
    registrarPagoMultiplesTurnos,
    enviarRecordatorioManual,
    cambiarEstadoTurno,
    verRespuestaTurno,
    confirmarRespuestaTurno
} = require('../controllers/turnos.controllers');
const { verificarToken, negarRoles } = require('../middlewares/auth.middleware');
const { upload } = require('../controllers/archivos.controllers');

const router = Router();

// Acciones que la agenda oculta al MEDICO: agendar, confirmar, cobrar y enviar recordatorios
const sinMedico = [verificarToken, negarRoles('MEDICO')];

// Respuesta del paciente desde el mail: sin sesión, protegida por el link firmado (GET muestra, POST confirma)
router.get('/turnos/respuesta', verRespuestaTurno);
router.post('/turnos/respuesta', confirmarRespuestaTurno);

// Rutas Administrativas (Protegidas)
router.get('/turnos', verificarToken, getTurnos);
router.post('/turnos', sinMedico, createTurno);
router.put('/turnos/:id', verificarToken, setTurno);
router.put('/turnos/:id/estado', sinMedico, cambiarEstadoTurno);
router.delete('/turnos/:id', verificarToken, deleteTurno);
router.get('/horarios', verificarToken, getHorarios);
router.post('/turnos/:id/pagar', sinMedico, upload.single('comprobante'), registrarPagoTurno);
router.post('/turnos/pagar-multiples', sinMedico, upload.single('comprobante'), registrarPagoMultiplesTurnos);
router.post('/turnos/:id/enviar-email', sinMedico, enviarRecordatorioManual);

module.exports = router;
