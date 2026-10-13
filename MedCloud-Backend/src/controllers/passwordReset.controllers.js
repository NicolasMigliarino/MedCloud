// ============================================================================
// Controlador de Recuperación de Contraseña por Email
// Gestiona el flujo completo: solicitud → validación → cambio de contraseña
// ============================================================================

const { getConnection, sql } = require('../db');
const crypto = require('crypto');
const { enviarRecuperarClave } = require('../utils/emailSender');

// Vigencia del link de recuperación (debe coincidir con sp_CreatePasswordResetToken)
const MINUTOS_LINK = 60;

// ============================================================================
// 1. SOLICITAR RECUPERACIÓN DE CONTRASEÑA
// POST /auth/forgot-password   Body: { email }
// ============================================================================
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    // Validación básica del campo email
    if (!email || !email.includes('@')) {
        return res.status(400).json({ message: 'Debés ingresar un email válido.' });
    }

    try {
        const pool = await getConnection();

        // Buscar usuario activo por email
        const result = await pool.request()
            .input('email', sql.VarChar, email.trim().toLowerCase())
            .execute('sp_GetUsuarioByEmail');

        // SEGURIDAD: Siempre retornar el mismo mensaje, sin importar si el email existe
        // Esto previene la enumeración de cuentas.
        if (result.recordset.length === 0) {
            console.log('⚠️ Solicitud de recuperación para un email no registrado');
            return res.json({
                message: 'Si el email está registrado en el sistema, recibirás las instrucciones en tu bandeja de entrada.'
            });
        }

        const usuario = result.recordset[0];

        // Generar token criptográfico seguro (32 bytes = 64 caracteres hex)
        const token = crypto.randomBytes(32).toString('hex');

        // Calcular fecha de expiración
        const fechaExpiracion = new Date(Date.now() + MINUTOS_LINK * 60 * 1000);

        // Guardar token en la base de datos (invalida tokens previos automáticamente)
        await pool.request()
            .input('usuario_id', sql.Int, usuario.id)
            .input('token', sql.VarChar, token)
            .input('fecha_expiracion', sql.DateTime, fechaExpiracion)
            .execute('sp_CreatePasswordResetToken');

        // El link sale siempre de la configuración, nunca de los encabezados del pedido
        // (si no, un tercero podría hacer que el mail apunte a su sitio y robar el código)
        const frontendUrl = (process.env.FRONTEND_URL || '').replace(/\/+$/, '');
        if (!frontendUrl) throw new Error('Falta FRONTEND_URL en la configuración.');
        const resetLink = `${frontendUrl}/reset-password/${token}`;

        await enviarRecuperarClave({
            email: usuario.email,
            usuario: usuario.username,
            enlace: resetLink,
            minutos: MINUTOS_LINK
        });

        console.log(`📧 Recuperación de contraseña encolada para el usuario ID ${usuario.id}`);

        res.json({
            message: 'Si el email está registrado en el sistema, recibirás las instrucciones en tu bandeja de entrada.'
        });

    } catch (error) {
        console.error('🚨 ERROR en forgotPassword:', error.message);
        res.status(500).json({ message: 'Ocurrió un error al procesar la solicitud. Intentá nuevamente más tarde.' });
    }
};

// ============================================================================
// 2. VALIDAR TOKEN DE RECUPERACIÓN
// POST /auth/validate-reset-token   Body: { token }
// ============================================================================
const validateResetToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ valid: false, message: 'Token no proporcionado.' });
    }

    try {
        const pool = await getConnection();

        const result = await pool.request()
            .input('token', sql.VarChar, token)
            .execute('sp_ValidatePasswordResetToken');

        if (result.recordset.length === 0) {
            return res.json({ valid: false, message: 'El enlace ha expirado o ya fue utilizado.' });
        }

        res.json({ valid: true, username: result.recordset[0].username });

    } catch (error) {
        console.error('🚨 ERROR en validateResetToken:', error.message);
        res.status(500).json({ valid: false, message: 'Error al validar el token.' });
    }
};

// ============================================================================
// 3. EJECUTAR CAMBIO DE CONTRASEÑA
// POST /auth/reset-password   Body: { token, newPassword }
// ============================================================================
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    // Validaciones básicas
    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }

    if (newPassword.length < 4) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 4 caracteres.' });
    }

    try {
        const pool = await getConnection();

        // Ejecutar el reset (el SP valida internamente el token y lanza error si es inválido)
        await pool.request()
            .input('token', sql.VarChar, token)
            .input('newPassword', sql.NVarChar, newPassword)
            .execute('sp_ResetPasswordByToken');

        console.log(`🔑 Contraseña restablecida exitosamente via token de recuperación.`);

        res.json({ message: 'Tu contraseña ha sido actualizada correctamente. Ya podés iniciar sesión.' });

    } catch (error) {
        console.error('🚨 ERROR en resetPassword:', error.message);

        // El SP lanza RAISERROR si el token es inválido/expirado
        if (error.message.includes('Token inválido o expirado')) {
            return res.status(400).json({ message: 'El enlace ha expirado o ya fue utilizado. Solicitá uno nuevo.' });
        }

        res.status(500).json({ message: 'Ocurrió un error al restablecer la contraseña.' });
    }
};

module.exports = { forgotPassword, validateResetToken, resetPassword };
