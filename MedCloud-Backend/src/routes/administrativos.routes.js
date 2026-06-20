const{ Router} = require('express');
const { getAdministrativos, createAdministrativo, deleteAdministrativo, setAdministrativo } = require('../controllers/administrativos.controllers');
const router = Router();

// Cuando alguien visite "/administrativos", se ejecuta la función getAdministrativos
router.get('/administrativos', getAdministrativos);

// Ruta para crear un nuevo administrativo
router.post('/administrativos', createAdministrativo); 

// PUT: Para editar. Se usa así: localhost:3000/medicos/1
router.put('/administrativos/:id', setAdministrativo);   

// DELETE: Para borrar. Se usa así: localhost:3000/medicos/1
router.delete('/administrativos/:id', deleteAdministrativo);

module.exports = router;