-- ============================================================================
-- MIGRACIÓN 010: Recuperación de Contraseña por Email
-- Fecha: 2026-05-30
-- Descripción: Crea la tabla de tokens temporales y los SPs para el flujo
--              completo de reset de contraseña vía correo electrónico.
-- ============================================================================

USE MedCloud;
GO

-- ── 1. Tabla de Tokens de Recuperación ──────────────────────────────────────
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='password_reset_tokens' AND xtype='U')
BEGIN
    CREATE TABLE password_reset_tokens (
        id                INT IDENTITY(1,1) PRIMARY KEY,
        usuario_id        INT NOT NULL,
        token             VARCHAR(255) NOT NULL UNIQUE,
        fecha_creacion    DATETIME NOT NULL DEFAULT GETDATE(),
        fecha_expiracion  DATETIME NOT NULL,
        usado             BIT NOT NULL DEFAULT 0,
        CONSTRAINT FK_password_reset_usuario FOREIGN KEY (usuario_id) 
            REFERENCES usuarios(id) ON DELETE CASCADE
    );

    -- Índice para búsquedas rápidas por token
    CREATE NONCLUSTERED INDEX IX_password_reset_token ON password_reset_tokens(token);
    -- Índice para limpieza de tokens expirados
    CREATE NONCLUSTERED INDEX IX_password_reset_expiracion ON password_reset_tokens(fecha_expiracion);

    PRINT '✅ Tabla password_reset_tokens creada exitosamente.';
END
ELSE
    PRINT '⚠️ La tabla password_reset_tokens ya existe.';
GO

-- ── 2. SP: Buscar usuario activo por email ──────────────────────────────────
IF OBJECT_ID('sp_GetUsuarioByEmail', 'P') IS NOT NULL DROP PROCEDURE sp_GetUsuarioByEmail;
GO

CREATE PROCEDURE sp_GetUsuarioByEmail
    @email VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT id, username, email
    FROM usuarios
    WHERE email = @email AND activo = 1;
END
GO

PRINT '✅ SP sp_GetUsuarioByEmail creado.';
GO

-- ── 3. SP: Crear token de recuperación (invalida previos) ───────────────────
IF OBJECT_ID('sp_CreatePasswordResetToken', 'P') IS NOT NULL DROP PROCEDURE sp_CreatePasswordResetToken;
GO

CREATE PROCEDURE sp_CreatePasswordResetToken
    @usuario_id INT,
    @token VARCHAR(255),
    @fecha_expiracion DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    -- Invalidar todos los tokens previos no usados de este usuario
    UPDATE password_reset_tokens 
    SET usado = 1 
    WHERE usuario_id = @usuario_id AND usado = 0;

    -- Insertar el nuevo token
    INSERT INTO password_reset_tokens (usuario_id, token, fecha_creacion, fecha_expiracion, usado)
    VALUES (@usuario_id, @token, GETDATE(), @fecha_expiracion, 0);
END
GO

PRINT '✅ SP sp_CreatePasswordResetToken creado.';
GO

-- ── 4. SP: Validar token (existe, no usado, no expirado) ────────────────────
IF OBJECT_ID('sp_ValidatePasswordResetToken', 'P') IS NOT NULL DROP PROCEDURE sp_ValidatePasswordResetToken;
GO

CREATE PROCEDURE sp_ValidatePasswordResetToken
    @token VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        prt.id,
        prt.usuario_id,
        prt.token,
        prt.fecha_expiracion,
        prt.usado,
        u.username,
        u.email
    FROM password_reset_tokens prt
    INNER JOIN usuarios u ON u.id = prt.usuario_id
    WHERE prt.token = @token
      AND prt.usado = 0
      AND prt.fecha_expiracion > GETDATE()
      AND u.activo = 1;
END
GO

PRINT '✅ SP sp_ValidatePasswordResetToken creado.';
GO

-- ── 5. SP: Resetear contraseña usando el token ──────────────────────────────
IF OBJECT_ID('sp_ResetPasswordByToken', 'P') IS NOT NULL DROP PROCEDURE sp_ResetPasswordByToken;
GO

CREATE PROCEDURE sp_ResetPasswordByToken
    @token VARCHAR(255),
    @newPassword NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @usuario_id INT;

    -- Buscar el token válido
    SELECT @usuario_id = usuario_id
    FROM password_reset_tokens
    WHERE token = @token
      AND usado = 0
      AND fecha_expiracion > GETDATE();

    -- Si no se encontró un token válido, retornar sin cambios
    IF @usuario_id IS NULL
    BEGIN
        RAISERROR('Token inválido o expirado.', 16, 1);
        RETURN;
    END

    -- Actualizar la contraseña del usuario y desactivar el flag de cambio obligatorio
    UPDATE usuarios 
    SET password_hash = @newPassword, 
        debe_cambiar_pass = 0
    WHERE id = @usuario_id;

    -- Marcar el token como usado
    UPDATE password_reset_tokens 
    SET usado = 1 
    WHERE token = @token;

    -- Invalidar cualquier otro token pendiente del mismo usuario
    UPDATE password_reset_tokens 
    SET usado = 1 
    WHERE usuario_id = @usuario_id AND usado = 0;
END
GO

PRINT '✅ SP sp_ResetPasswordByToken creado.';
PRINT '🎉 Migración 010 completada exitosamente.';
GO

