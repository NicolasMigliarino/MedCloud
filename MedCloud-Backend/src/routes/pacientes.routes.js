const { Router } = require('express');
const { getPacientes,getPaciente,createPaciente,deletePaciente, setPaciente,getObrasSociales, getHistorialAsistenciaPaciente } = require('../controllers/pacientes.controllers');
const { verificarToken, permitirRoles, negarRoles } = require('../middlewares/auth.middleware');
const router = Router();

// Altas, bajas y modificaciones: mismas restricciones que la pantalla (ADMIN y RECEPCION)
const gestionPacientes = [verificarToken, permitirRoles('ADMIN', 'RECEPCION')];

// Listado (el SP filtra por usuario: el médico ve solo sus pacientes)
router.get('/pacientes', verificarToken, getPacientes);

// Historial de asistencia del paciente (el listado lo oculta al MEDICO)
router.get('/pacientes/:id/asistencia', verificarToken, negarRoles('MEDICO'), getHistorialAsistenciaPaciente);

// La Singular para editar o ver un solo paciente
router.get('/pacientes/:id', verificarToken, getPaciente);

router.post('/pacientes', gestionPacientes, createPaciente);
router.put('/pacientes/:id', gestionPacientes, setPaciente);
router.delete('/pacientes/:id', gestionPacientes, deletePaciente);

// Lista de obras sociales (formulario de pacientes)
router.get('/obras-sociales', verificarToken, getObrasSociales);

module.exports = router;
