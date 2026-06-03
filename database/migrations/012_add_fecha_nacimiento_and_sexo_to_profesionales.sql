-- ============================================================================
-- MIGRACIÓN 012: Agregar Fecha de Nacimiento y Sexo a Profesionales
-- Fecha: 2026-06-02
-- Descripción: Agrega los campos fecha_nacimiento y sexo a la tabla profesionales,
--              y actualiza sp_CreateProfesional y sp_SetProfesional.
-- ============================================================================

USE MedicApp;
GO

-- ── 1. Agregar Columnas a Profesionales ──────────────────────────────────────
IF NOT EXISTS (
    SELECT * 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'profesionales' AND COLUMN_NAME = 'fecha_nacimiento'
)
BEGIN
    ALTER TABLE dbo.profesionales ADD fecha_nacimiento DATE NULL;
    PRINT '✅ Columna fecha_nacimiento agregada a profesionales.';
END
ELSE
    PRINT '⚠️ La columna fecha_nacimiento ya existe en profesionales.';
GO

IF NOT EXISTS (
    SELECT * 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'profesionales' AND COLUMN_NAME = 'sexo'
)
BEGIN
    ALTER TABLE dbo.profesionales ADD sexo NVARCHAR(50) NULL;
    PRINT '✅ Columna sexo agregada a profesionales.';
END
ELSE
    PRINT '⚠️ La columna sexo ya existe en profesionales.';
GO

-- ── 2. SP: sp_CreateProfesional Actualizado ─────────────────────────────────
IF OBJECT_ID('sp_CreateProfesional', 'P') IS NOT NULL 
    DROP PROCEDURE sp_CreateProfesional;
GO

CREATE PROCEDURE [dbo].[sp_CreateProfesional]
    @Nombre NVARCHAR(100),
    @Apellido NVARCHAR(100),
    @DNI NVARCHAR(20),       
    @Matricula NVARCHAR(50),
    @Especialidad NVARCHAR(100),
    @Telefono NVARCHAR(50),
    @duracionTurnoPromedio INT,
    @RolID INT = 2,
    @HorariosJSON NVARCHAR(MAX) = NULL,
    @PorcentajeRetencion DECIMAL(5,2) = 20.00,
    @TipoMatricula NVARCHAR(20) = NULL,
    @CuitCuil NVARCHAR(20) = NULL,
    @fecha_nacimiento DATE = NULL,
    @sexo NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @NuevoUsuarioID INT;
        DECLARE @NuevoProfesionalID INT; 
        DECLARE @UsuarioBase VARCHAR(50);
        DECLARE @UsuarioFinal VARCHAR(50);
        DECLARE @Contador INT = 0;
        DECLARE @PasswordProvisoria NVARCHAR(255);
        DECLARE @EmailGenerado NVARCHAR(100); 

        -- Lógica para generar usuario único
        SET @UsuarioBase = LOWER(SUBSTRING(@Nombre, 1, 1) + @Apellido);
        SET @UsuarioFinal = @UsuarioBase;

        -- Loop para encontrar un usuario libre
        WHILE EXISTS (SELECT 1 FROM dbo.usuarios WHERE username = @UsuarioFinal)
        BEGIN
            SET @Contador = @Contador + 1;
            SET @UsuarioFinal = @UsuarioBase + CAST(@Contador AS VARCHAR(5));
        END

        -- Generamos un email ficticio y password temporal
        SET @EmailGenerado = @UsuarioFinal + '@medicapp.local';
        SET @PasswordProvisoria = @DNI; 

        -- 1. Insertamos en la tabla PADRE (Usuarios)
        INSERT INTO dbo.usuarios (email, password_hash, rol_id, activo, fecha_creacion, username, debe_cambiar_pass)
        VALUES (@EmailGenerado, @PasswordProvisoria, @RolID, 1, GETDATE(), @UsuarioFinal, 1);

        -- Recuperamos el ID del usuario
        SET @NuevoUsuarioID = SCOPE_IDENTITY();

        -- 2. Insertamos en la tabla HIJA (Profesionales) con porcentaje_retencion, tipo_matricula, cuit_cuil, fecha_nacimiento, sexo
        INSERT INTO dbo.profesionales(usuario_id, nombre, apellido, matricula, especialidad, telefono, duracion_turno_promedio, porcentaje_retencion, tipo_matricula, cuit_cuil, fecha_nacimiento, sexo)
        VALUES (@NuevoUsuarioID, @Nombre, @Apellido, @Matricula, @Especialidad, @Telefono, @duracionTurnoPromedio, @PorcentajeRetencion, @TipoMatricula, @CuitCuil, @fecha_nacimiento, @sexo);

        -- Recuperamos el ID del PROFESIONAL recién creado
        SET @NuevoProfesionalID = SCOPE_IDENTITY();

        -- 3. Lógica para insertar horarios (Opcional)
        IF @HorariosJSON IS NOT NULL AND ISJSON(@HorariosJSON) = 1
        BEGIN
            INSERT INTO dbo.horarios_profesional (profesional_id, dia_semana, hora_inicio, hora_fin)
            SELECT 
                @NuevoProfesionalID, 
                dia_semana, 
                hora_inicio, 
                hora_fin
            FROM OPENJSON(@HorariosJSON)
            WITH (
                dia_semana VARCHAR(20) '$.dia_semana',
                hora_inicio TIME '$.hora_inicio',
                hora_fin TIME '$.hora_fin'
            );
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO

PRINT '✅ SP sp_CreateProfesional actualizado.';
GO

-- ── 3. SP: sp_SetProfesional Actualizado ────────────────────────────────────
IF OBJECT_ID('sp_SetProfesional', 'P') IS NOT NULL 
    DROP PROCEDURE sp_SetProfesional;
GO

CREATE PROCEDURE [dbo].[sp_SetProfesional]
    @id INT,
    @nombre NVARCHAR(100),
    @apellido NVARCHAR(100),
    @matricula NVARCHAR(50),
    @especialidad NVARCHAR(100),
    @telefono NVARCHAR(50),
    @duracionTurnoPromedio INT,
    @porcentajeRetencion DECIMAL(5,2) = 20.00,
    @tipoMatricula NVARCHAR(20) = NULL,
    @cuitCuil NVARCHAR(20) = NULL,
    @fecha_nacimiento DATE = NULL,
    @sexo NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE profesionales
    SET nombre = @nombre,
        apellido = @apellido,
        matricula = @matricula,
        especialidad = @especialidad,
        telefono = @telefono,
        duracion_turno_promedio = @duracionTurnoPromedio,
        porcentaje_retencion = @porcentajeRetencion,
        tipo_matricula = @tipoMatricula,
        cuit_cuil = @cuitCuil,
        fecha_nacimiento = @fecha_nacimiento,
        sexo = @sexo
    WHERE id = @id;
END
GO

PRINT '✅ SP sp_SetProfesional actualizado.';
PRINT '🎉 Migración 012 completada exitosamente.';
GO
