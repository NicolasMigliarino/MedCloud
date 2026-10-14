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
- Backend: `routes/turnos.routes.js`, `controllers/turnos.controllers.js`, `utils/emailSender.js`, `utils/scheduler.js`, `utils/reciboHelper.js`, `utils/enlacesTurno.js`, `utils/paginaTurno.js`, `utils/horaArgentina.js`, `utils/mensajeria.js`

**Reglas**
- El cobro registra el pago en la caja abierta y confirma el turno. En efectivo se genera un recibo HTML en `uploads/`; con transferencia o MercadoPago se adjunta el comprobante.
- El día anterior, cada paciente recibe un recordatorio con dos botones: confirmar o cancelar. El paciente solo puede cambiar turnos Pendiente o Confirmado que todavía no empezaron. Un turno Cancelado no se puede volver a confirmar desde el mail.
- `PUT /turnos/:id/estado` valida que el estado sea uno de los cuatro permitidos.

## Mails

**Estado:** en uso (requiere la mensajería instalada)  ·  **Permisos:** automático y botón Mail de la agenda (todos menos MEDICO)

**Archivos**
- Backend: `utils/mensajeria.js` (cliente), `utils/emailSender.js` (datos de cada plantilla), `utils/scheduler.js`, `controllers/passwordReset.controllers.js`, `routes/soporte.routes.js`
- Plantillas: repo muchocodigo-mensajeria, `plantillas/medcloud/` (`recordatorio-turno`, `agenda-medico`, `recuperar-clave`, `soporte`)

**Reglas**
- Sin `MENSAJERIA_URL` y `MENSAJERIA_CLAVE`, el scheduler no envía y lo avisa al arrancar. El botón Mail y el soporte responden un error.
- El link de recuperación sale siempre de `FRONTEND_URL`, nunca de los encabezados del pedido.
- La agenda del médico se recorta a ~3.800 caracteres, con el aviso "y N turnos más (ver MedCloud)". La mensajería admite hasta 4.000 por dato.

## Caja diaria y liquidaciones

**Estado:** en uso  ·  **Permisos:** ADMIN y RECEPCION

**Archivos**
- Frontend: `CajaControl.jsx`, `CajaHistorial.jsx`, `Liquidaciones.jsx`
- Backend: `routes/caja.routes.js`, `controllers/caja.controllers.js`, `routes/pagos.routes.js`, `controllers/pagos.controllers.js`

## Cómo se probó (avance del 2026-10-13: mails por la mensajería)

- Prueba con base y mensajería simuladas, sin conexión real ni envíos: 34 casos OK.
  - **Links firmados:** se verifican; se rechazan si se alteran, si se cambia el turno o si están mal formados; vencen.
  - **Hora argentina:** "mañana" va de 03:00 a 03:00 UTC, y un turno de 13:30 UTC se muestra 10:30.
  - **Plantillas:** cada pedido trae exactamente los datos que pide su plantilla (se leyeron los JSON reales de `plantillas/medcloud/`). El recordatorio va sin motivo ni especialidad. La agenda incluye el motivo y se recorta.
  - **Recuperar contraseña:** usa `FRONTEND_URL` e ignora el `Origin`. Con un email inexistente da la misma respuesta y no se envía nada.
  - **Página del paciente:** el GET no cambia el estado; el POST confirma o cancela. Turno ya pasado: 410. Completado o Cancelado: 409. Link inválido: 400. Un nombre con HTML se muestra escapado y la página no tiene scripts. La ruta vieja `/turnos/accion-publica` ya no existe.
  - **Recordatorios:** se buscan por el rango del día argentino.
- La prueba de permisos del paso 1 sigue OK, incluida `PUT /turnos/:id/estado` (MEDICO: 403).
- **Falta probar** con la mensajería instalada en el servidor: envío real a una casilla propia y respuesta desde el celular.

## Cómo se probó (avance del 2026-10-10)

- Prueba aislada de permisos con las rutas reales, tokens de cada rol y una base inexistente (sin scheduler ni mails): 29 rutas × 4 casos (sin sesión, MEDICO, RECEPCION, ADMIN) dan 401/403/acceso según la matriz de [api.md](api.md); `PUT`/`DELETE /historial/:id` dan 404; un nombre de archivo con `../` se reduce a un nombre dentro de `uploads/`.
- Bloqueo de escalada con base simulada: 16 casos (crear, editar y borrar usuarios ADMIN y el rol ADMIN siendo RECEPCION o ADMIN) dan el resultado esperado.
- `node --check` de todo el backend, `npm run build` del frontend y lint sin problemas nuevos.
- **No se probó contra la base real** (no hay acceso todavía): falta recorrer en el navegador el ingreso, el cambio de contraseña inicial, la apertura de estudios y recibos y el borrado de pacientes con un usuario de cada rol.
