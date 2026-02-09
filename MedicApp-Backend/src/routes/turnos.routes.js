const { Router } = require('express');
const { getTurnos, createTurno, setTurno, deleteTurno } = require('../controllers/turnos.controllers');
const router = Router();

router.get('/turnos', getTurnos);
router.post('/turnos', createTurno);
router.put('/turnos/:id', setTurno);
router.delete('/turnos/:id', deleteTurno);

module.exports = router;