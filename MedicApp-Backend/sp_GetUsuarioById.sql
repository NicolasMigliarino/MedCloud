CREATE PROCEDURE sp_GetUsuarioById
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        id,
        email,
        password_hash,
        rol_id,
        activo,
        fecha_creacion,
        username,
        debe_cambiar_pass
    FROM Usuarios
    WHERE id = @id;
END
GO
