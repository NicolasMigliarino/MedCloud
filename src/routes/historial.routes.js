const { Router } = require('express');
const { getHistoriales, createHistorial, updateHistorial, deleteHistorial } = require('../controllers/historial.controllers');
const router = Router();

router.get('/historiales', getHistoriales);
router.post('/historiales', createHistorial);
router.put('/historiales/:id', updateHistorial);
router.delete('/historiales/:id', deleteHistorial);

module.exports = router;