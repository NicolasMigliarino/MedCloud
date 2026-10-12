require('dotenv').config();
require('./config'); // Valida la configuración sensible antes de levantar el servidor
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

// IMPORTACIONES DE RUTAS
const pacientesRoutes = require('./routes/pacientes.routes');
const profesionalesRoutes = require('./routes/profesionales.routes');
const turnosRoutes = require('./routes/turnos.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const rolesRoutes = require('./routes/roles.routes');
const administrativosRoutes = require('./routes/administrativos.routes');
const historialRoutes = require('./routes/historial.routes');
const authRoutes = require('./routes/auth.routes');
const archivosRoutes = require('./routes/archivos.routes');
const cajaRoutes = require('./routes/caja.routes');
const passwordResetRoutes = require('./routes/passwordReset.routes');
const soporteRoutes = require('./routes/soporte.routes');
const pagosRoutes = require('./routes/pagos.routes');
const { verificarToken } = require('./middlewares/auth.middleware');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// USO DE RUTAS
app.use(pacientesRoutes);
app.use(profesionalesRoutes);
app.use(turnosRoutes);
app.use(usuariosRoutes);
app.use(rolesRoutes);
app.use(administrativosRoutes);
app.use(historialRoutes);
app.use(authRoutes);
app.use(archivosRoutes);
app.use(cajaRoutes);
app.use(passwordResetRoutes);
app.use(soporteRoutes);
app.use(pagosRoutes);

// Archivos subidos (estudios, comprobantes y recibos): solo con sesión iniciada.
// Si un recibo en efectivo no existe en disco, se regenera a partir del pago.
app.get('/uploads/:filename', verificarToken, async (req, res) => {
    // basename evita salir de la carpeta uploads (ej: "..%2F..%2F.env")
    const filename = path.basename(req.params.filename);
    const fs = require('fs');
    const filepath = path.join(__dirname, '../uploads', filename);

    if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
        return res.sendFile(filepath);
    }

    if (filename.startsWith('recibo_efectivo_')) {
        try {
            const { getConnection, sql } = require('./db');
            const { generarReciboEfectivo } = require('./utils/reciboHelper');
            const pool = await getConnection();
            
            const urlPath = `/uploads/${filename}`;
            const pagoResult = await pool.request()
                .input('url', sql.NVarChar, urlPath)
                .query(`
                    SELECT TOP 1 p.id, p.monto_bruto, p.fecha_pago, t.fecha_hora_inicio,
                           pac.nombre AS paciente_nombre, pac.apellido AS paciente_apellido, pac.dni AS paciente_dni,
                           prof.nombre AS profesional_nombre, prof.apellido AS profesional_apellido
                    FROM dbo.pagos p
                    INNER JOIN dbo.turnos t ON p.turno_id = t.id
                    INNER JOIN dbo.pacientes pac ON t.paciente_id = pac.id
                    INNER JOIN dbo.profesionales prof ON t.profesional_id = prof.id
                    WHERE p.comprobante_url = @url OR p.comprobante_url LIKE '%' + @url
                `);

            if (pagoResult.recordset.length > 0) {
                const p = pagoResult.recordset[0];
                const pacienteNombre = `${p.paciente_nombre} ${p.paciente_apellido}`;
                const profesionalNombre = `${p.profesional_nombre} ${p.profesional_apellido}`;
                const fechaConsulta = p.fecha_hora_inicio ? new Date(p.fecha_hora_inicio).toLocaleString('es-AR') : 'Sin fecha';
                
                generarReciboEfectivo(pacienteNombre, p.paciente_dni || '', profesionalNombre, fechaConsulta, parseFloat(p.monto_bruto || 0), p.id, filename);
                
                if (fs.existsSync(filepath)) {
                    return res.sendFile(filepath);
                }
            }
        } catch (e) {
            console.error('Error al regenerar recibo dinámicamente:', e.message);
        }
    }

    return res.status(404).send('Comprobante no encontrado.');
});
const { iniciarScheduler } = require('./utils/scheduler');

// Manejo de errores (opcional pero recomendado)
app.use((err, req, res, next) => {
    return res.json({
        message: err.message
    });
});

app.listen(3000, () => {
    console.log('Server on port 3000');
    iniciarScheduler(); // Iniciar programador de recordatorios por email
});