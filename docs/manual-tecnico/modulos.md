# Módulos

Cada módulo tiene su pantalla en `frontend/src/components/` y su API en `MedCloud-Backend/src/routes/` y `src/controllers/`. Los permisos de cada endpoint están en [api.md](api.md).

## Sesión y seguridad

**Estado:** en uso  ·  **Permisos:** todos

**Archivos**
- Frontend: `LoginPage.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`, `ProtectedRoute.jsx`, `App.jsx`, `utils/auth.js`, `utils/useInactivityTimer.js`
- Backend: `controllers/auth.controllers.js`, `controllers/passwordReset.controllers.js`, `middlewares/auth.middleware.js`, `config.js`, `utils/roles.js`

**Reglas**
- Sesión JWT de 8 h firmada con `JWT_SECRET`; sesión única por usuario; cierre por 15 minutos de inactividad.
- Cambio de contraseña obligatorio en el primer ingreso: el frontend envía el token recibido en el login de forma explícita, porque todavía no está guardado.
- Un `401` cierra la sesión en el navegador y lleva al ingreso.

## Usuarios y roles

**Estado:** en uso  ·  **Permisos:** ADMIN y RECEPCION

**Archivos**
- Frontend: `UsuariosList.jsx`, `UsuariosForm.jsx`, `RolList.jsx`, `RolForm.jsx`
- Backend: `routes/usuarios.routes.js`, `routes/roles.routes.js`, `controllers/usuarios.controllers.js`, `controllers/roles.controllers.js`

**Reglas**
- Solo un ADMIN gestiona usuarios ADMIN o el rol ADMIN (evita que recepción se cree un administrador).

## Pacientes

**Estado:** en uso  ·  **Permisos:** listado y ficha para todos; alta, edición y baja para ADMIN y RECEPCION; asistencia y pagos ocultos al MEDICO

**Archivos**
- Frontend: `PacientesList.jsx`, `PacientesForm.jsx`
- Backend: `routes/pacientes.routes.js`, `controllers/pacientes.controllers.js`, `routes/archivos.routes.js`, `controllers/archivos.controllers.js`

**Reglas**
- El teléfono se normaliza a `549…` (`utils/phoneFormatter.js`).
- Los estudios se suben a `uploads/` y se ven solo con sesión.

## Historia clínica

**Estado:** en uso  ·  **Permisos:** solo MEDICO

**Archivos**
- Frontend: `HistorialClinico.jsx`
- Backend: `routes/historial.routes.js`, `controllers/historial.controllers.js`

**Reglas**
- El médico se toma del token. Las evoluciones no se editan ni se borran (Ley 26.529).

## Profesionales

**Estado:** en uso  ·  **Permisos:** consulta para todos; gestión para ADMIN y RECEPCION

**Archivos**
- Frontend: `ProfesionalList.jsx`, `ProfesionalForm.jsx`
- Backend: `routes/profesionales.routes.js`, `controllers/profesionales.controllers.js`

**Reglas**
- La pantalla carga el % de honorario del médico y el backend guarda la retención de la clínica (`100 − honorario`).

## Turnos

**Estado:** en uso  ·  **Permisos:** agenda para todos; agendar, confirmar, cobrar y enviar mails para todos menos MEDICO

**Archivos**
- Frontend: `TurnosList.jsx`, `TurnosForm.jsx`
- Backend: `routes/turnos.routes.js`, `controllers/turnos.controllers.js`, `utils/emailSender.js`, `utils/scheduler.js`, `utils/reciboHelper.js`

**Reglas**
- El cobro registra el pago en la caja abierta y confirma el turno. En efectivo se genera un recibo HTML en `uploads/`; con transferencia o MercadoPago se adjunta el comprobante.

## Caja diaria y liquidaciones

**Estado:** en uso  ·  **Permisos:** ADMIN y RECEPCION

**Archivos**
- Frontend: `CajaControl.jsx`, `CajaHistorial.jsx`, `Liquidaciones.jsx`
- Backend: `routes/caja.routes.js`, `controllers/caja.controllers.js`, `routes/pagos.routes.js`, `controllers/pagos.controllers.js`

## Cómo se probó (avance del 2026-10-10)

- Prueba aislada de permisos con las rutas reales, tokens de cada rol y una base inexistente (sin scheduler ni mails): 29 rutas × 4 casos (sin sesión, MEDICO, RECEPCION, ADMIN) dan 401/403/acceso según la matriz de [api.md](api.md); `PUT`/`DELETE /historial/:id` dan 404; un nombre de archivo con `../` se reduce a un nombre dentro de `uploads/`.
- Bloqueo de escalada con base simulada: 16 casos (crear, editar y borrar usuarios ADMIN y el rol ADMIN siendo RECEPCION o ADMIN) dan el resultado esperado.
- `node --check` de todo el backend, `npm run build` del frontend y lint sin problemas nuevos.
- **No se probó contra la base real** (no hay acceso todavía): falta recorrer en el navegador el ingreso, el cambio de contraseña inicial, la apertura de estudios y recibos y el borrado de pacientes con un usuario de cada rol.
