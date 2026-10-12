# Arquitectura

MedCloud separa navegador, API y base de datos. La API es delgada: recibe el pedido, valida sesión y rol, ejecuta un procedimiento almacenado y responde.

```
Navegador (React + Vite)  --HTTP/JSON + token JWT-->  API (Node + Express)  --TDS-->  SQL Server (sp_*)
```

## Carpetas

```
MedCloud-Backend/
  src/index.js              arranque: rutas, archivos de /uploads, scheduler de recordatorios
  src/config.js             configuración sensible del .env (JWT_SECRET); si falta, no arranca
  src/db.js                 pool de conexión a SQL Server
  src/middlewares/          auth.middleware.js: verificarToken, permitirRoles, negarRoles
  src/routes/               definición de endpoints y permisos por ruta
  src/controllers/          llaman a los procedimientos almacenados
  src/utils/                emailSender, scheduler, reciboHelper, phoneFormatter, roles
  uploads/                  estudios, comprobantes y recibos (no se versiona)
frontend/
  src/main.jsx              axios global: agrega el token y la URL del backend (API_URL)
  src/App.jsx               rutas, ProtectedRoute por rol, sesión vencida, inactividad, trial
  src/config.js             API_URL
  src/utils/                auth.js (usuario y rol), archivos.js (abrir archivos con sesión)
  src/components/           una pantalla por componente
database/DER.md             modelo de datos documentado
docs/                       manuales de usuario y técnico
```

## Sesión

1. `POST /login` ejecuta `sp_LoginUsuario`, compara la contraseña y firma un JWT (8 h) con `id`, `username`, `rol`, `trial_dias_restantes` y un `session_id` aleatorio que también se guarda en `usuarios.session_token`.
2. El frontend guarda el token en `localStorage` y el interceptor de `main.jsx` lo envía como `Authorization: Bearer <token>` en cada pedido.
3. `verificarToken` valida firma y vencimiento con `JWT_SECRET`, compara `session_id` con el de la base (sesión única: si el usuario entra en otro equipo, la sesión anterior recibe `401 CONCURRENT_LOGIN_DISPLACED`) y bloquea las escrituras si el trial está vencido (`403 TRIAL_EXPIRED`).
4. Cualquier `401` con sesión guardada borra la sesión en el navegador y lleva al ingreso con el aviso "Sesión vencida" (o "Sesión finalizada" si fue desplazada). También se cierra a los 15 minutos sin actividad.

## Permisos

- `permitirRoles(...)` deja pasar solo a los roles indicados; `negarRoles(...)` bloquea a los indicados. Se usan después de `verificarToken`.
- Regla del proyecto: **el backend replica lo que muestra el frontend**. Si una pantalla es solo para ADMIN y RECEPCION (`ProtectedRoute allowedRoles`), su API usa `permitirRoles('ADMIN', 'RECEPCION')`; si un botón se oculta al MEDICO, su API usa `negarRoles('MEDICO')`. La matriz completa está en [api.md](api.md).
- Escalada de privilegios: aunque RECEPCION administra usuarios y roles, solo un ADMIN puede crear, editar o borrar usuarios con rol ADMIN, asignar ese rol o tocar el rol ADMIN (`src/utils/roles.js`).
- Historia clínica: solo MEDICO, y el médico se toma siempre del token (`req.user.id`), nunca de la URL o del cuerpo.

## Archivos subidos

Los archivos de `uploads/` (estudios, comprobantes de transferencia, recibos de efectivo generados en HTML) se sirven solo con sesión en `GET /uploads/:archivo`. El nombre se reduce con `path.basename` para que no se pueda salir de la carpeta. Si un recibo de efectivo no existe en disco, se regenera a partir del pago. En el frontend, `utils/archivos.js` los descarga con el token y los abre en una pestaña nueva (la pestaña se abre en el mismo clic para que el navegador no la bloquee).

## Decisiones de diseño

- **Sin edición ni borrado de evoluciones clínicas**: la historia clínica es inviolable (Ley 26.529, art. 18). Las rutas `PUT/DELETE /historial/:id` se quitaron; ninguna pantalla las usaba.
- **Falla temprana de configuración**: sin `JWT_SECRET` (mínimo 32 caracteres) el servidor no arranca, para que nunca funcione con una firma conocida.
- **Recordatorios**: `utils/scheduler.js` corre dentro del mismo proceso cada 10 minutos (pacientes del día siguiente y agenda de cada médico a las 20 h). Si se levantan dos instancias, se duplican los mails.
