const { Router } = require('express');
const { getHistoriales, createHistorial, setHistorial, deleteHistorial, compartirHistorial } = require('../controllers/historial.controllers');
const router = Router();

// GET: Traer historial filtrado por privacidad (¡Esta es la que necesita React para mostrar la lista!)
router.get('/historial/paciente/:paciente_id/profesional/:profesional_id', getHistoriales);

// POST: Crear nueva evolución
router.post('/historial', createHistorial);

// POST: Compartir evolución
router.post('/historial/compartir', compartirHistorial); 

// PUT y DELETE: Editar y Borrar
router.put('/historial/:id', setHistorial);
router.delete('/historial/:id', deleteHistorial);

module.exports = router;