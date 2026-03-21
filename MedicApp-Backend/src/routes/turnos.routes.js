const { Router } = require('express');
const { getTurnos, createTurno, setTurno, deleteTurno, getHorarios, registrarPagoTurno } = require('../controllers/turnos.controllers');
const router = Router();

router.get('/turnos', getTurnos);
router.post('/turnos', createTurno);
router.put('/turnos/:id', setTurno);
router.delete('/turnos/:id', deleteTurno);
router.get('/horarios', getHorarios);
router.post('/turnos/:id/pagar', registrarPagoTurno);
module.exports = router;