const { getConnection, sql } = require('../db');

const getAdministrativos = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM dbo.administrativos');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createAdministrativo = async (req, res) => {
    const { usuario_id, nombre, apellido } = req.body;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('usuario_id', sql.Int, usuario_id)
            .input('nombre', sql.NVarChar, nombre)
            .input('apellido', sql.NVarChar, apellido)
            .query('INSERT INTO dbo.administrativos (usuario_id, nombre, apellido) VALUES (@usuario_id, @nombre, @apellido)');
        res.json({ msg: 'Administrativo creado' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateAdministrativo = async (req, res) => {
    const { id } = req.params; 
    const { usuario_id, nombre, apellido } = req.body; // Los datos nuevos vienen en el cuerpo (body)
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('usuario_id', sql.Int, usuario_id)
            .input('nombre', sql.NVarChar, nombre)
            .input('apellido', sql.NVarChar, apellido)
            .query('UPDATE dbo.administrativos SET usuario_id=@usuario_id, nombre=@nombre, apellido=@apellido WHERE id=@id');
       // --- VALIDACIÓN NUEVA ---
        if (result.rowsAffected[0] === 0) {
            // Si SQL dice que tocó 0 filas, es que el ID no existe
            return res.status(404).json({ message: 'Médico no encontrado' });
        }

        res.json({ msg: 'Paciente actualizado correctamente' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteAdministrativo = async (req, res) => {
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
            return res.status(404).json({ message: 'No se encontró Administrativo para eliminar' });
        }
        // Si llegó hasta aquí, rowsAffected fue mayor a 0, así que el borrado fue exitoso.
        // Respondemos 204 (No Content), que es el estándar para un borrado exitoso (no devolvemos datos, solo confirmación).
        return res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al intentar eliminar' });
    }
};

module.exports = { getAdministrativos, createAdministrativo, updateAdministrativo, deleteAdministrativo };