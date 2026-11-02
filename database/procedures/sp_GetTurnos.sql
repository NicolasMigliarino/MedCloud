-- Agenda de turnos. El MEDICO ve solo los suyos; el resto, todos.
-- Antes de listar, pasa a Completado los turnos Confirmados que ya terminaron.
-- pagado / metodo_pago salen de Pagos (un pago por turno, lo garantiza sp_RegistrarPagoTurno): la agenda los usa para
-- mostrar "Pagado" y ocultar Cobrar aunque el pago no tenga comprobante (tarjeta, obra social).
CREATE OR ALTER PROCEDURE [dbo].[sp_GetTurnos]
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
        p.nombre AS paciente_nombre, p.apellido AS paciente_apellido,
        pg.comprobante_url,
        CAST(CASE WHEN pg.turno_id IS NULL THEN 0 ELSE 1 END AS bit) AS pagado,
        pg.metodo_pago
    FROM Turnos t
    INNER JOIN Profesionales pr ON t.profesional_id = pr.id
    INNER JOIN Pacientes p ON t.paciente_id = p.id
    LEFT JOIN Pagos pg ON t.id = pg.turno_id
    WHERE
        (@RolCodigo <> 'MEDICO' OR t.profesional_id = @ProfesionalID)
    ORDER BY t.fecha_hora_inicio DESC;
END;
