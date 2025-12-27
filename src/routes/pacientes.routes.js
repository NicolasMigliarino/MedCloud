const { Router } = require('express');
const { getPacientes,createPaciente,deletePaciente, updatePaciente } = require('../controllers/pacientes.controllers');
const router = Router();

// Cuando alguien visite "/pacientes", se ejecuta la función getPacientes
router.get('/pacientes', getPacientes);

// Ruta para crear un nuevo paciente
router.post('/pacientes', createPaciente);

// PUT: Para editar. Se usa así: localhost:3000/pacientes/1
router.put('/pacientes/:id', updatePaciente);

// DELETE: Para borrar. Se usa así: localhost:3000/pacientes/1
router.delete('/pacientes/:id', deletePaciente);

module.exports = router;