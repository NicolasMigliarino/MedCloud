const{ Router} = require('express');
const { getProfesional,getProfesionales, createProfesional, deleteProfesional, setProfesional } = require('../controllers/profesionales.controllers');
const router = Router();

// Cuando alguien visite "/profesionales", se ejecuta la función getProfesionales
router.get('/profesionales', getProfesionales);

// La Singular para editar o ver un solo profesional
router.get('/profesionales/:id', getProfesional);

// PUT: Para editar. Se usa así: localhost:3000/profesionales/1
router.put('/profesionales/:id', setProfesional);   

// DELETE: Para borrar. Se usa así: localhost:3000/profesionales/1
router.delete('/profesionales/:id', deleteProfesional);

// Ruta para crear un nuevo médico
router.post('/profesionales', createProfesional); 

module.exports = router;