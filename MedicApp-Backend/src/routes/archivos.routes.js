const { Router } = require('express');
const { upload, uploadArchivoMedicos, getArchivosPaciente } = require('../controllers/archivos.controllers');

const router = Router();

// Fíjate que usamos 'upload.single("archivo")' como middleware interceptor
router.post('/archivos', upload.single('archivo'), uploadArchivoMedicos);
router.get('/archivos/:paciente_id', getArchivosPaciente);

module.exports = router;