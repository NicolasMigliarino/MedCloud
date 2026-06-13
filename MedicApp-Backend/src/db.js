/* =========================================================================
   ARCHIVO: src/db.js
   DESCRIPCIÓN: Conexión estándar con Usuario y Contraseña.
   Esta es la forma más compatible y estable.
   ========================================================================= */
const sql = require('mssql');

const dbSettings = {
    server: process.env.DB_HOST || 'medicapp-sql',
    database: process.env.DB_NAME || 'MedicApp',
    user: process.env.DB_USER || 'medicapp_user',
    password: process.env.DB_PASSWORD || 'MedicApp123',
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: true
    }
};

let poolPromise = null;
let migracionesRealizadas = false;

async function getConnection() {
    if (!poolPromise) {
        poolPromise = (async () => {
            try {
                const pool = await sql.connect(dbSettings);
                if (!migracionesRealizadas) {
                    migracionesRealizadas = true;
                    try {
                        await pool.request().query(`
                            IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.turnos') AND name = 'recordatorio_dia_anterior_enviado')
                            BEGIN
                                ALTER TABLE dbo.turnos ADD recordatorio_dia_anterior_enviado BIT NOT NULL DEFAULT 0;
                            END

                            IF OBJECT_ID('dbo.envios_agenda_medica', 'U') IS NULL
                            BEGIN
                                CREATE TABLE dbo.envios_agenda_medica (
                                    id INT IDENTITY(1,1) PRIMARY KEY,
                                    profesional_id INT NOT NULL,
                                    fecha_agenda DATE NOT NULL,
                                    fecha_envio DATETIME NOT NULL DEFAULT GETDATE(),
                                    CONSTRAINT FK_EnviosAgenda_Profesionales FOREIGN KEY (profesional_id) REFERENCES dbo.profesionales(id) ON DELETE CASCADE
                                );
                            END
                        `);

                        await pool.request().query(`
                            ALTER PROCEDURE [dbo].[sp_GetTurnos]
                                @UsuarioID INT,
                                @RolCodigo NVARCHAR(20)
                            AS
                            BEGIN
                                SET NOCOUNT ON;

                                UPDATE Turnos
                                SET estado = 'Completado'
                                WHERE estado = 'Confirmado' 
                                  AND fecha_hora_fin <= GETDATE();

                                DECLARE @ProfesionalID INT = NULL;

                                IF @RolCodigo = 'MEDICO' 
                                BEGIN
                                    SELECT @ProfesionalID = id 
                                    FROM Profesionales 
                                    WHERE usuario_id = @UsuarioID;
                                END

                                SELECT 
                                    t.id, t.paciente_id, t.profesional_id, t.fecha_hora_inicio, t.fecha_hora_fin, t.estado, t.motivo_consulta, t.observaciones_admin,
                                    t.recordatorio_dia_anterior_enviado AS recordatorio_enviado,
                                    pr.nombre AS profesional_nombre, pr.apellido AS profesional_apellido,
                                    p.nombre AS paciente_nombre, p.apellido AS paciente_apellido
                                FROM Turnos t
                                INNER JOIN Profesionales pr ON t.profesional_id = pr.id
                                INNER JOIN Pacientes p ON t.paciente_id = p.id
                                WHERE 
                                    (@RolCodigo <> 'MEDICO' OR t.profesional_id = @ProfesionalID)
                                ORDER BY t.fecha_hora_inicio DESC;
                            END;
                        `);

                        await pool.request().query(`
                            ALTER PROCEDURE [dbo].[sp_GetUsuarios]
                            AS
                            BEGIN
                                SET NOCOUNT ON;
                                SELECT 
                                    u.id, 
                                    u.email, 
                                    u.password_hash, 
                                    u.rol_id, 
                                    u.activo, 
                                    u.fecha_creacion, 
                                    u.username, 
                                    u.debe_cambiar_pass,
                                    pr.nombre AS profesional_nombre,
                                    pr.apellido AS profesional_apellido
                                FROM Usuarios u
                                LEFT JOIN Profesionales pr ON pr.usuario_id = u.id;
                            END;
                        `);

                        await pool.request().query(`
                            ALTER PROCEDURE [dbo].[sp_SetUsuario]
                                @id INT,
                                @email NVARCHAR(100),
                                @passwordHash NVARCHAR(255) = NULL,
                                @rolId INT,
                                @activo BIT,
                                @username VARCHAR(100),
                                @debeCambiarPass BIT
                            AS
                            BEGIN
                                SET NOCOUNT ON;
                                UPDATE Usuarios
                                SET email = @email,
                                    password_hash = CASE WHEN @passwordHash IS NULL OR @passwordHash = '' THEN password_hash ELSE @passwordHash END,
                                    rol_id = @rolId,
                                    activo = @activo,
                                    username = @username,
                                    debe_cambiar_pass = @debeCambiarPass
                                WHERE id = @id;
                            END;
                        `);
                        console.log('✔️ Base de Datos: Migraciones de recordatorios, sp_GetTurnos, sp_GetUsuarios y sp_SetUsuario aplicadas.');
                    } catch (migErr) {
                        migracionesRealizadas = false;
                        console.error('⚠️ Error al aplicar migraciones de recordatorios:', migErr.message);
                    }
                }
                return pool;
            } catch (error) {
                poolPromise = null; // resetear si falló la conexión inicial
                console.error('ERROR DE CONEXIÓN:', error);
                throw error;
            }
        })();
    }
    return poolPromise;
}

module.exports = { getConnection, sql };