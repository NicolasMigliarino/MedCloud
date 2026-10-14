# Base de datos

SQL Server, base `MedCloud`. El modelo está documentado en [`database/DER.md`](../../database/DER.md).

> ⚠️ Los procedimientos almacenados **no están versionados en el repositorio**: existen solo en la base. Exportarlos a `database/` (un archivo por objeto, `CREATE OR ALTER`, como en StockyApp) está pendiente.

## Procedimientos que usa el backend

| Módulo | Procedimientos |
|---|---|
| Sesión | `sp_LoginUsuario`, `sp_ChangePassword`, `sp_GetUsuarioByEmail`, `sp_CreatePasswordResetToken`, `sp_ValidatePasswordResetToken`, `sp_ResetPasswordByToken` |
| Usuarios y roles | `sp_GetUsuarios`, `sp_GetUsuarioById`, `sp_CreateUsuario`, `sp_SetUsuario`, `sp_DeleteUsuario`, `sp_GetRoles`, `sp_CreateRol`, `sp_SetRoles`, `sp_DeleteRol` |
| Administrativos | `getAdministrativos`, `createAdministrativo`, `setAdministrativo`, `deleteAdministrativo` |
| Profesionales | `sp_GetProfesionales`, `sp_GetProfesional`, `sp_CreateProfesional`, `sp_SetProfesional`, `sp_DeleteProfesional`, `sp_GetEspecialidades` |
| Pacientes | `sp_GetPacientes`, `sp_GetPaciente`, `sp_CreatePaciente`, `sp_SetPaciente`, `sp_DeletePaciente`, `sp_GetObrasSociales`, `sp_GetHistorialAsistenciaPaciente` |
| Historia clínica | `sp_GetHistorialesClinicos`, `sp_CreateHistorialClinico`, `sp_Set_CompartirHistorial` |
| Archivos | `sp_UploadArchivo`, `sp_GetArchivosPaciente` |
| Turnos | `sp_GetTurnos`, `sp_CreateTurno`, `sp_SetTurno`, `sp_DeleteTurno`, `sp_GetHorarios`, `sp_RegistrarPagoTurno`, `sp_CambiarEstadoTurno` |
| Caja y pagos | `sp_AbrirCaja`, `sp_CerrarCaja`, `sp_GetLiquidacionProfesional`, `sp_GetHistorialPagosPaciente`, `sp_GetHistorialPagosProfesional`, `sp_RegistrarPagoProfesional` |

También hay consultas SQL armadas en el código (pendientes de pasar a procedimientos): caja activa e historial (`caja.controllers.js`), recordatorios, agenda de médicos y cambio de estado de turnos, tanto desde la agenda como desde el link del mail (`turnos.controllers.js`, `utils/scheduler.js`; usan `UPDATE Turnos SET estado` con la condición en el mismo `UPDATE`), regeneración de recibos (`index.js`), control de sesión única (`auth.middleware.js`) y guardado de `session_token` en el login.

## Supuestos del código sobre la base

- `sp_GetRoles` devuelve `id` y `codigo`. Los códigos de rol usados son `ADMIN`, `RECEPCION` y `MEDICO`; `src/utils/roles.js` los usa para impedir la escalada de privilegios.
- `sp_GetUsuarioById` devuelve `rol_id`.
- `sp_GetHistorialesClinicos` y `sp_CreateHistorialClinico` reciben `usuario_id` (el usuario del token) y resuelven el profesional y la privacidad dentro del procedimiento.
- `usuarios.session_token` guarda la sesión activa (la columna se crea en el primer login si no existe).
- Estados de turno (`CK_Turnos_Estado`): `Pendiente`, `Confirmado`, `Completado`, `Cancelado`.
- `profesionales.sexo` (`Femenino` / `Masculino` / otros) define "Dra." o "Dr." en los mails; `turnos.recordatorio_dia_anterior_enviado` marca el recordatorio ya encolado; `envios_agenda_medico` registra la agenda enviada por médico y fecha.
- Las fechas de los turnos son instantes. El driver `mssql` los lee como UTC y MedCloud los muestra en hora argentina. Las cargas desde el formulario se interpretan en la zona del proceso (por eso `TZ` en Docker).

## Pendiente de verificar con acceso de solo lectura

- Si `sp_GetUsuarios` o `sp_GetUsuarioById` devuelven `password_hash`.
- Si `sp_SetProfesional` conserva horarios y DNI (el backend no los envía al editar).
- Si `sp_Set_CompartirHistorial` valida que quien comparte sea el autor de la evolución.
- Columna de especialidad vigente en `profesionales` (`especialidad` en texto o `especialidad_id`).
