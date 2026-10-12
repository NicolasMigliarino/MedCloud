const { Router } = require('express');
const { getHistoriales, createHistorial, compartirHistorial } = require('../controllers/historial.controllers');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');
const router = Router();

// La historia clínica es exclusiva del rol MEDICO (igual que la pantalla).
// El médico se toma siempre del token, nunca de la URL ni del cuerpo.
const soloMedico = [verificarToken, permitirRoles('MEDICO')];

router.get('/historial/paciente/:paciente_id', soloMedico, getHistoriales);
// Ruta anterior: se mantiene por compatibilidad; el id de profesional de la URL se ignora
router.get('/historial/paciente/:paciente_id/profesional/:profesional_id', soloMedico, getHistoriales);

router.post('/historial', soloMedico, createHistorial);
router.post('/historial/compartir', soloMedico, compartirHistorial);

// No hay rutas para editar ni borrar evoluciones: la historia clínica es inviolable (Ley 26.529, art. 18)
// y ninguna pantalla las usaba.

module.exports = router;
