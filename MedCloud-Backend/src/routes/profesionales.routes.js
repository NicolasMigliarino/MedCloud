const { Router } = require('express');
const { getProfesional, getProfesionales, createProfesional, deleteProfesional, setProfesional, getEspecialidades } = require('../controllers/profesionales.controllers');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');
const router = Router();

// Altas, bajas y modificaciones: mismas restricciones que la pantalla (ADMIN y RECEPCION)
const gestionProfesionales = [verificarToken, permitirRoles('ADMIN', 'RECEPCION')];

// Lecturas: cualquier usuario logueado (los médicos usan el listado en turnos y para compartir historias)
router.get('/especialidades', verificarToken, getEspecialidades);
router.get('/profesionales', verificarToken, getProfesionales);
router.get('/profesionales/:id', verificarToken, getProfesional);

router.post('/profesionales', gestionProfesionales, createProfesional);
router.put('/profesionales/:id', gestionProfesionales, setProfesional);
router.delete('/profesionales/:id', gestionProfesionales, deleteProfesional);

module.exports = router;
