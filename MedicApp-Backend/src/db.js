/* =========================================================================
   ARCHIVO: src/db.js
   DESCRIPCIÓN: Conexión estándar con Usuario y Contraseña.
   Esta es la forma más compatible y estable.
   ========================================================================= */
const sql = require('mssql');

const dbSettings = {
    server: 'localhost',
    database: 'MedicApp',
    user: 'medicapp_user',      // El usuario que acabamos de crear
    password: 'MedicApp123',    // La contraseña que pusimos en el script
    options: {
        encrypt: false, // Importante para SQL local
        trustServerCertificate: true // Confía en el certificado local
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
                        console.log('✔️ Base de Datos: Migraciones de recordatorios y SPs aplicadas.');
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