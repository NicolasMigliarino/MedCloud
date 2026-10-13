# Historial de cambios

## 2026-10-13 — Mails por la mensajería y confirmar o cancelar turnos desde el mail

- **Qué cambió:**
  - MedCloud deja de usar SMTP (Gmail): todos los mails salen por muchocodigo-mensajeria con las plantillas `medcloud/*`.
  - El recordatorio al paciente trae links firmados para confirmar o cancelar, con una página intermedia de confirmación y validación de estado y horario. Reemplaza la ruta pública por id (`/turnos/accion-publica`), que nunca llegó a producción.
  - El recordatorio ya no muestra especialidad.
  - La agenda del médico incluye el motivo de consulta.
  - Fechas y horas en hora argentina, sin depender de la zona del servidor.
  - El link de recuperación de contraseña sale solo de `FRONTEND_URL`, que ya no se arma con el `Origin` del pedido: cierra el riesgo de link apuntando a otro sitio.
  - Los logs de recuperación ya no muestran emails.
- **Módulos:** turnos, mails, sesión (recuperar contraseña), soporte.
- **Backend/API:**
  - Nuevas: `GET`/`POST /turnos/respuesta` (públicas, protegidas por el link firmado) y `PUT /turnos/:id/estado` (todos menos MEDICO, con validación del estado).
  - Quitada: `/turnos/accion-publica`.
  - Nuevos `utils/mensajeria.js`, `utils/enlacesTurno.js`, `utils/paginaTurno.js` y `utils/horaArgentina.js`.
  - Se quitaron `nodemailer` y el script `test-notifs.js`.
- **Base de datos:** sin objetos nuevos. Se lee `profesionales.sexo` (Dr./Dra.) y el estado se cambia con un `UPDATE` condicionado.
- **Configuración:**
  - Nuevas: `MENSAJERIA_URL`, `MENSAJERIA_CLAVE`, `SOPORTE_EMAIL` y `TZ=America/Argentina/Buenos_Aires`.
  - Se quitan las `SMTP_*`.
  - `FRONTEND_URL` pasa a ser obligatoria para recuperar la contraseña.
  - El backend tiene que estar en la red Docker `muchocodigo`.
- **Pruebas:** ver [modulos.md](modulos.md).
- **Commits:** ver el PR de la rama `mails/mensajeria`.

## 2026-10-10 — Seguridad: sesión y permisos en todas las rutas

- **Qué cambió:**
  - Todas las rutas de la API exigen sesión, salvo el login, la recuperación de contraseña y el link público de turnos.
  - Los permisos por rol replican los del frontend.
  - Solo un ADMIN gestiona usuarios o el rol ADMIN.
  - El cambio de contraseña solo permite la propia (o cualquiera si sos ADMIN).
  - La historia clínica toma al médico del token, y se quitaron la edición y el borrado de evoluciones.
  - Los archivos de `uploads/` se sirven solo con sesión y sin poder salir de la carpeta.
  - El secreto de las sesiones pasa al `.env` (`JWT_SECRET`).
  - `jsonwebtoken` queda declarada como dependencia.
  - Se corrigió el borrado de pacientes, que nunca respondía.
  - Se corrigieron los links de recibos que apuntaban a `localhost`.
  - La sesión vencida ahora lleva al ingreso.
- **Módulos:** sesión, usuarios, roles, profesionales, administrativos, pacientes, historia clínica, archivos, turnos, caja, liquidaciones.
- **Backend/API:**
  - Nuevos: `GET /historial/paciente/:id`, `src/config.js`, `src/utils/roles.js`, y `permitirRoles`/`negarRoles` en `auth.middleware.js`.
  - Eliminados: `PUT/DELETE /historial/:id`.
  - `GET /uploads/:archivo` ahora requiere sesión.
  - Falta de token: ahora `401` (antes `403`).
  - `DELETE /pacientes/:id` responde `204`.
- **Frontend:**
  - Nuevo `utils/archivos.js`.
  - Estudios y recibos se abren con sesión desde `PacientesForm`, `PacientesList`, `HistorialClinico`, `Liquidaciones` y `TurnosList`.
  - El cambio de contraseña inicial envía el token.
  - Aviso de "Sesión vencida" en `App.jsx`.
- **Base de datos:** sin cambios (se usan `sp_GetRoles` y `sp_GetUsuarioById` para el control de escalada).
- **Configuración:** nueva variable obligatoria `JWT_SECRET` y nuevo `MedCloud-Backend/.env.example`. Al desplegar se cierran todas las sesiones una vez.
- **Pendiente:** el link público de confirmación/cancelación de turnos (`/turnos/accion-publica`, cambio todavía sin commitear) necesita un token firmado antes de subir a producción.
- **Pruebas:** ver [modulos.md](modulos.md#cómo-se-probó-avance-del-2026-10-10).
- **Commits:** `0048fc7` (ignorar archivos del servidor), `bc7dae9` (JWT_SECRET), `a9599f1` (sesión y roles en rutas), `63cf961` (borrar paciente), `88db6d9` (frontend: archivos con sesión y sesión vencida).
