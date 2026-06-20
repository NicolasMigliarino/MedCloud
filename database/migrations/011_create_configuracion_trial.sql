-- ============================================================================
-- MIGRACIÓN 011: Configuración de Periodo de Prueba (Trial)
-- Fecha: 2026-06-02
-- Descripción: Crea la tabla de configuración de trial, inicializa el periodo,
--              crea el SP sp_VerificarTrial y actualiza sp_LoginUsuario.
-- ============================================================================

USE MedCloud;
GO

-- ── 1. Tabla de Configuración del Trial ──────────────────────────────────────
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='configuracion_trial' AND xtype='U')
BEGIN
    CREATE TABLE configuracion_trial (
        id                INT IDENTITY(1,1) PRIMARY KEY,
        es_trial          BIT NOT NULL DEFAULT 1,
        fecha_inicio      DATETIME NOT NULL DEFAULT GETDATE(),
        duracion_dias     INT NOT NULL DEFAULT 15,
        contacto_soporte  NVARCHAR(100) NOT NULL DEFAULT 'contacto@MedCloud.com'
    );

    -- Insertar configuración inicial (15 días de prueba a partir de hoy)
    INSERT INTO configuracion_trial (es_trial, fecha_inicio, duracion_dias, contacto_soporte)
    VALUES (1, GETDATE(), 15, 'soporte@MedCloud.com');

    PRINT '✅ Tabla configuracion_trial creada e inicializada.';
END
ELSE
    PRINT '⚠️ La tabla configuracion_trial ya existe.';
GO

-- ── 2. SP: Verificar Trial Expirado ─────────────────────────────────────────
IF OBJECT_ID('sp_VerificarTrial', 'P') IS NOT NULL 
    DROP PROCEDURE sp_VerificarTrial;
GO

CREATE PROCEDURE sp_VerificarTrial
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @es_trial BIT;
    DECLARE @fecha_inicio DATETIME;
    DECLARE @duracion_dias INT;

    SELECT TOP 1 
        @es_trial = es_trial, 
        @fecha_inicio = fecha_inicio, 
        @duracion_dias = duracion_dias 
    FROM configuracion_trial;

    IF @es_trial = 1 AND DATEDIFF(day, GETDATE(), DATEADD(day, @duracion_dias, @fecha_inicio)) < 0
    BEGIN
        ;THROW 50001, 'El periodo de prueba de MedCloud ha expirado. Por favor, contacte a soporte para activar su cuenta.', 1;
    END;
END
GO

PRINT '✅ SP sp_VerificarTrial creado exitosamente.';
GO

-- ── 3. SP: sp_LoginUsuario Actualizado (con Días Restantes) ─────────────────
IF OBJECT_ID('sp_LoginUsuario', 'P') IS NOT NULL 
    DROP PROCEDURE sp_LoginUsuario;
GO

CREATE PROCEDURE [dbo].[sp_LoginUsuario]
    @username NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        u.id, 
        u.username, 
        u.password_hash, 
        u.rol_id, 
        u.debe_cambiar_pass,
        r.codigo as rol_codigo, 
        r.nombre as rol_nombre,
        CASE 
            WHEN c.es_trial = 1 THEN DATEDIFF(day, GETDATE(), DATEADD(day, c.duracion_dias, c.fecha_inicio))
            ELSE 999 
        END AS trial_dias_restantes
    FROM Usuarios u
    INNER JOIN Roles r ON u.rol_id = r.id
    CROSS JOIN (
        SELECT TOP 1 es_trial, fecha_inicio, duracion_dias 
        FROM dbo.configuracion_trial
    ) c
    WHERE u.username = @username 
      AND u.activo = 1;
END
GO

PRINT '✅ SP sp_LoginUsuario actualizado con retorno de días de prueba.';
PRINT '🎉 Migración 011 completada exitosamente.';
GO

