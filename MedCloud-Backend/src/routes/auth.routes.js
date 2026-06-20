// src/routes/auth.routes.js
const { Router } = require('express');
const { login } = require('../controllers/auth.controllers');

const router = Router();

router.post('/login', login);

module.exports = router;