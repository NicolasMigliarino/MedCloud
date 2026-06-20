const{ Router} = require('express');
const { getRoles, createRol, deleteRol, setRol } = require('../controllers/roles.controllers');
const router = Router();

// Cuando alguien visite "/rol", se ejecuta la función getRoles
router.get('/roles', getRoles);

// Ruta para crear un nuevo rol
router.post('/roles', createRol); 

// PUT: Para editar. Se usa así: localhost:3000/medicos/1
router.put('/roles/:id', setRol);   

// DELETE: Para borrar. Se usa así: localhost:3000/medicos/1
router.delete('/roles/:id', deleteRol);

module.exports = router;
