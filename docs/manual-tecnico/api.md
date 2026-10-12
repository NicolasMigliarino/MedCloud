# API

Todas las rutas, salvo las públicas indicadas, requieren `Authorization: Bearer <token>`.

Roles: **A** = ADMIN, **R** = RECEPCION, **M** = MEDICO, **Todos** = cualquier usuario con sesión. "Todos menos M" significa que cualquier rol excepto MEDICO puede usarla.

Errores comunes de sesión y permisos:

| Código | Cuándo |
|---|---|
| `401` | Falta el token, es inválido o venció (`Token inválido o expirado`) |
| `401` `CONCURRENT_LOGIN_DISPLACED` | El usuario inició sesión en otro equipo |
| `403` | El rol no tiene permiso (`No tenés permisos para realizar esta acción.`) |
| `403` `TRIAL_EXPIRED` | Período de prueba vencido: solo se permiten lecturas (GET) |
| `500` | Error de base de datos (texto del error) |

## Públicas

| Método | Ruta | Uso |
|---|---|---|
| POST | `/login` | Ingreso. Cuerpo `{ username, password }` → `{ token, user }` |
| POST | `/auth/forgot-password` | Pide el mail de recuperación. Responde siempre el mismo mensaje |
| POST | `/auth/validate-reset-token` | Valida el link de recuperación |
| POST | `/auth/reset-password` | Cambia la contraseña con el link |
| GET | `/turnos/accion-publica?id=&accion=` | Confirmar o cancelar desde el mail (en desarrollo, todavía sin firma; ver changelog) |

## Sesión

| Método | Ruta | Roles | Uso |
|---|---|---|---|
| GET | `/auth/verify-session` | Todos | Control de sesión única (cada 30 s desde el frontend) |

## Usuarios

| Método | Ruta | Roles | Notas |
|---|---|---|---|
| GET | `/usuarios`, `/usuarios/:id` | A, R | |
| POST | `/usuarios` | A, R | Solo A puede crear con rol ADMIN (`403`) |
| PUT | `/usuarios/:id` | A, R | Solo A puede editar a un ADMIN o asignar el rol ADMIN (`403`) |
| DELETE | `/usuarios/:id` | A, R | Solo A puede borrar a un ADMIN (`403`) |
| PUT | `/usuarios/:id/password` | Todos | Solo la propia contraseña; A puede cambiar cualquiera (`403 Solo podés cambiar tu propia contraseña.`) |

## Roles

| Método | Ruta | Roles | Notas |
|---|---|---|---|
| GET | `/roles` | A, R | |
| POST / PUT / DELETE | `/roles`, `/roles/:id` | A, R | Solo A puede crear, editar o borrar el rol con código ADMIN (`403`) |

## Profesionales

| Método | Ruta | Roles |
|---|---|---|
| GET | `/profesionales`, `/profesionales/:id`, `/especialidades` | Todos |
| POST / PUT / DELETE | `/profesionales`, `/profesionales/:id` | A, R |

## Administrativos

| Método | Ruta | Roles | Notas |
|---|---|---|---|
| GET / POST / PUT / DELETE | `/administrativos`, `/administrativos/:id` | A | Ninguna pantalla las usa |

## Pacientes

| Método | Ruta | Roles | Notas |
|---|---|---|---|
| GET | `/pacientes` | Todos | `sp_GetPacientes` filtra por usuario (el médico ve los suyos) |
| GET | `/pacientes/:id` | Todos | |
| GET | `/pacientes/:id/asistencia` | Todos menos M | |
| POST / PUT | `/pacientes`, `/pacientes/:id` | A, R | |
| DELETE | `/pacientes/:id` | A, R | Responde `204` |
| GET | `/obras-sociales` | Todos | |

## Historia clínica

El médico se identifica siempre por el token, nunca por la URL ni por el cuerpo.

| Método | Ruta | Roles | Notas |
|---|---|---|---|
| GET | `/historial/paciente/:paciente_id` | M | |
| GET | `/historial/paciente/:paciente_id/profesional/:x` | M | Ruta anterior; `:x` se ignora |
| POST | `/historial` | M | `{ paciente_id, turno_id, motivo, evolucion, diagnostico, tratamiento }` |
| POST | `/historial/compartir` | M | `{ historial_id, profesional_invitado_id }` |

No existen `PUT` ni `DELETE`: las evoluciones no se modifican ni se borran.

## Archivos

| Método | Ruta | Roles | Notas |
|---|---|---|---|
| POST | `/archivos` | A, R | `multipart/form-data`, campo `archivo`, más `paciente_id` y `turno_id` |
| GET | `/archivos/:paciente_id` | Todos | Lista de estudios del paciente |
| GET | `/uploads/:archivo` | Todos | Descarga el archivo; regenera recibos de efectivo faltantes. `404` si no existe |

## Turnos

| Método | Ruta | Roles |
|---|---|---|
| GET | `/turnos`, `/horarios` | Todos |
| POST | `/turnos` | Todos menos M |
| PUT | `/turnos/:id` | Todos |
| DELETE | `/turnos/:id` | Todos |
| PUT | `/turnos/:id/estado` | Todos menos M |
| POST | `/turnos/:id/pagar` | Todos menos M |
| POST | `/turnos/pagar-multiples` | Todos menos M |
| POST | `/turnos/:id/enviar-email` | Todos menos M |

## Caja y liquidaciones

| Método | Ruta | Roles |
|---|---|---|
| GET | `/caja/activa`, `/caja/historial` | A, R |
| POST | `/caja/abrir`, `/caja/cerrar` | A, R |
| GET | `/liquidaciones?profesional_id=&fecha_desde=&fecha_hasta=` | A, R |
| GET | `/pagos/profesional/:id` | A, R |
| POST | `/pagos/profesional/:id` | A, R |
| GET | `/pagos/paciente/:id` | Todos menos M |

## Soporte

| Método | Ruta | Roles |
|---|---|---|
| POST | `/api/soporte` | Todos |
