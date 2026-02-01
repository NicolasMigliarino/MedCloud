const { getConnection, sql } = require('../db');

const getRoles = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM dbo.roles');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createRol = async (req, res) => {
    const { nombre, codigo } = req.body;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('codigo', sql.VarChar, codigo)
            .query('INSERT INTO dbo.roles (nombre, codigo) VALUES (@nombre, @codigo)');
        res.json({ msg: 'Rol creado' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// CORRECCIÓN PARA updateRol (y aplica igual para updateMedico, updateUsuario, etc.)
const updateRol = async (req, res) => {
    const { id } = req.params;
    const { nombre, codigo } = req.body;
    try {
        const pool = await getConnection();
        
        // PASO 1: Guardamos el resultado
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, nombre)
            .input('codigo', sql.VarChar, codigo)
            .query('UPDATE dbo.roles SET nombre = @nombre, codigo = @codigo WHERE id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        res.json({ msg: 'Rol actualizado correctamente' });

    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteRol = async (req, res) => {
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
            return res.status(404).json({ message: 'No se encontró Rol para eliminar' });
        }
        // Si llegó hasta aquí, rowsAffected fue mayor a 0, así que el borrado fue exitoso.
        // Respondemos 204 (No Content), que es el estándar para un borrado exitoso (no devolvemos datos, solo confirmación).
        return res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al intentar eliminar' });
    }
};

module.exports = { getRoles, createRol, updateRol, deleteRol };