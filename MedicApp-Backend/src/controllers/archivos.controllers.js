const { getConnection, sql } = require('../db');
const multer = require('multer');
const path = require('path');

// Configuración de Multer (Dónde y cómo guardar los archivos)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Los guarda en la carpeta uploads/
    },
    filename: function (req, file, cb) {
        // Le pone la fecha actual adelante para que el nombre sea único
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Middleware que usaremos en las rutas
const upload = multer({ storage: storage });

// Controlador para guardar en la BD
const uploadArchivoMedicos = async (req, res) => {
    try {
        const { paciente_id, turno_id } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'Por favor seleccione un archivo.' });
        }

        const pool = await getConnection();
        await pool.request()
            .input('paciente_id', sql.Int, paciente_id)
            .input('turno_id', sql.Int, turno_id || null)
            .input('nombre_original', sql.NVarChar, file.originalname)
            .input('nombre_archivo', sql.NVarChar, file.filename)
            .input('tipo_archivo', sql.NVarChar, file.mimetype)
            .execute('sp_UploadArchivo');

        res.json({ msg: 'Archivo subido correctamente', file: file.filename });
    } catch (error) {
        console.error("🚨 ERROR AL SUBIR ARCHIVO:", error.message);
        res.status(500).send(error.message);
    }
};

// Controlador para obtener la lista de archivos de un paciente
const getArchivosPaciente = async (req, res) => {
    try {
        const { paciente_id } = req.params;
        const pool = await getConnection();
        const result = await pool.request()
            .input('paciente_id', sql.Int, paciente_id)
            .execute('sp_GetArchivosPaciente');

        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { upload, uploadArchivoMedicos, getArchivosPaciente };