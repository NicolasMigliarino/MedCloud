const { Router } = require('express');
const { getTurnos, createTurno, setTurno, deleteTurno, getHorarios, registrarPagoTurno } = require('../controllers/turnos.controllers');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = Router();

router.get('/turnos', verificarToken, getTurnos);
router.post('/turnos', verificarToken, createTurno);
router.put('/turnos/:id', verificarToken, setTurno);
router.delete('/turnos/:id', verificarToken, deleteTurno);
router.get('/horarios', verificarToken, getHorarios);
router.post('/turnos/:id/pagar', verificarToken, registrarPagoTurno);
module.exports = router;