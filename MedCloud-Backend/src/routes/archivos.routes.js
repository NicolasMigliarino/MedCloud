const { Router } = require('express');
const { upload, uploadArchivoMedicos, getArchivosPaciente } = require('../controllers/archivos.controllers');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

const router = Router();

// Subida de estudios: desde la ficha del paciente (ADMIN y RECEPCION)
router.post('/archivos', verificarToken, permitirRoles('ADMIN', 'RECEPCION'), upload.single('archivo'), uploadArchivoMedicos);
// Listado de estudios: ficha del paciente e historia clínica
router.get('/archivos/:paciente_id', verificarToken, getArchivosPaciente);

module.exports = router;
