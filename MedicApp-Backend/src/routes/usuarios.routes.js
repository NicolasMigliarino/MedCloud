const{ Router} = require('express');
const { getUsuarios, createUsuario, deleteUsuario, updateUsuario } = require('../controllers/usuarios.controllers');
const router = Router();

// Cuando alguien visite "/usuarios", se ejecuta la función getUsuario
router.get('/usuarios', getUsuarios);

// Ruta para crear un nuevo usuario
router.post('/usuarios', createUsuario); 

// PUT: Para editar. Se usa así: localhost:3000/medicos/1
router.put('/usuarios/:id', updateUsuario);   

// DELETE: Para borrar. Se usa así: localhost:3000/medicos/1
router.delete('/usuarios/:id', deleteUsuario);

module.exports = router;