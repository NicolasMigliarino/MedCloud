# Historial de cambios

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
