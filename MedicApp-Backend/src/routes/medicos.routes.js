const{ Router} = require('express');
const { getMedicos, createMedico, deleteMedico, updateMedico } = require('../controllers/medicos.controllers');
const router = Router();

// Cuando alguien visite "/medicos", se ejecuta la función getMedicos
router.get('/medicos', getMedicos);

// Ruta para crear un nuevo médico
router.post('/medicos', createMedico); 

// PUT: Para editar. Se usa así: localhost:3000/medicos/1
router.put('/medicos/:id', updateMedico);   

// DELETE: Para borrar. Se usa así: localhost:3000/medicos/1
router.delete('/medicos/:id', deleteMedico);

module.exports = router;