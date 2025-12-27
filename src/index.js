// ====================================================================
// ARCHIVO: src/index.js
// DESCRIPCIÓN: Punto de entrada de la aplicación (Entry Point).
//              Inicia el servidor Express y define las rutas principales.
// ====================================================================

const express = require('express');
const cors = require('cors');
const { getConnection } = require('./db'); // Importamos nuestra conexión
const pacientesRoutes = require('./routes/pacientes.routes');
const medicosRoutes = require('./routes/medicos.routes');

const app = express(); // Inicializamos Express

// --- MIDDLEWARES (Configuraciones previas) ---
app.use(cors());         // Permite que el Frontend se conecte sin bloqueos
app.use(express.json()); // Permite recibir datos en formato JSON

// --- RUTAS (Endpoints) ---

// Ruta de prueba para verificar estado del servidor y BD

// NUEVO: Le decimos al servidor que use las rutas de pacientes
app.use(pacientesRoutes);
app.use(medicosRoutes);

// --- ARRANQUE DEL SERVIDOR ---
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});