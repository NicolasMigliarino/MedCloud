const { Router } = require('express');
const { getUsuarios, getUsuarioById, createUsuario, deleteUsuario, setUsuario } = require('../controllers/usuarios.controllers');
const router = Router();

// Cuando alguien visite "/usuarios", se ejecuta la función getUsuario
router.get('/usuarios', getUsuarios);

// Ruta para obtener un usuario especifico
router.get('/usuarios/:id', getUsuarioById);

// Ruta para crear un nuevo usuario
router.post('/usuarios', createUsuario);

// PUT: Para editar. Se usa así: localhost:3000/medicos/1
router.put('/usuarios/:id', setUsuario);

// DELETE: Para borrar. Se usa así: localhost:3000/medicos/1
router.delete('/usuarios/:id', deleteUsuario);

module.exports = router;