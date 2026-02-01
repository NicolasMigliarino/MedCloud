const { getConnection, sql } = require('../db');

const getUsuarios = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM dbo.usuarios');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createUsuario = async (req, res) => {
    const { email, password_hash, rol_id, activo, username, debe_cambiar_pass } = req.body;
    const fecha_creacion = new Date(); // Generamos la fecha actual

    try {
        const pool = await getConnection();
        await pool.request()
            .input('email', sql.NVarChar, email)
            .input('password_hash', sql.NVarChar, password_hash)
            .input('rol_id', sql.Int, rol_id)
            .input('activo', sql.Bit, activo)
            .input('fecha_creacion', sql.DateTime, fecha_creacion)
            .input('username', sql.VarChar, username)
            .input('debe_cambiar_pass', sql.Bit, debe_cambiar_pass)
            .query('INSERT INTO dbo.usuarios (email, password_hash, rol_id, activo, fecha_creacion, username, debe_cambiar_pass) VALUES (@email, @password_hash, @rol_id, @activo, @fecha_creacion, @username, @debe_cambiar_pass)');
        res.json({ msg: 'Usuario creado' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { email, password_hash, rol_id, activo, username, debe_cambiar_pass } = req.body;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('email', sql.NVarChar, email)
            .input('password_hash', sql.NVarChar, password_hash)
            .input('rol_id', sql.Int, rol_id)
            .input('activo', sql.Bit, activo)
            .input('username', sql.VarChar, username)
            .input('debe_cambiar_pass', sql.Bit, debe_cambiar_pass)
            .query('UPDATE dbo.usuarios SET email=@email, password_hash=@password_hash, rol_id=@rol_id, activo=@activo, username=@username, debe_cambiar_pass=@debe_cambiar_pass WHERE id=@id');
        res.json({ msg: 'Usuario actualizado' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        
        // PASO 1: Guardamos el resultado de la operación en la constante 'result'
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Medicos WHERE id = @id');

        // 'rowsAffected' es un array que devuelve SQL Server indicando cuántas filas sufrieron cambios.
        // Si rowsAffected[0] es 0, significa que la instrucción corrió bien, pero no encontró a nadie con ese ID.
        if (result.rowsAffected[0] === 0) {
            // Devolvemos 404 (Not Found) para avisar al Frontend que no se borró nada porque no existía.
            return res.status(404).json({ message: 'No se encontró el Usuario para eliminar' });
        }
        // Si llegó hasta aquí, rowsAffected fue mayor a 0, así que el borrado fue exitoso.
        // Respondemos 204 (No Content), que es el estándar para un borrado exitoso (no devolvemos datos, solo confirmación).
        return res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al intentar eliminar' });
    }
};

module.exports = { getUsuarios, createUsuario, updateUsuario, deleteUsuario };