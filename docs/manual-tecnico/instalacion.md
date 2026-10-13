# Instalación

Requisitos:
- Node 20 o superior.
- SQL Server con la base `MedCloud` y sus procedimientos `sp_*`.
- Para mandar mails, el servicio **muchocodigo-mensajeria** (repo aparte, envía por Resend) con un cliente dado de alta para la clínica.

## Variables de entorno del backend

Se configuran en `MedCloud-Backend/.env` en desarrollo, o en el `environment:` del `docker-compose.yml` del servidor. La plantilla es `MedCloud-Backend/.env.example`.

| Variable | Obligatoria | Uso |
|---|---|---|
| `PORT` | no | Documentada; hoy el servidor escucha fijo en 3000 |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_ENCRYPT` | sí | Conexión a SQL Server (`src/db.js`) |
| `JWT_SECRET` | **sí** | Firma de las sesiones y de los links de turnos. Mínimo 32 caracteres; sin ella el servidor no arranca |
| `TZ` | **sí en Docker** | `America/Argentina/Buenos_Aires`. Las horas que carga el formulario de turnos se interpretan en la zona del proceso; los contenedores vienen en UTC y sin esto los turnos quedan corridos 3 horas |
| `MENSAJERIA_URL` | para mails | URL del servicio de mensajería. En el servidor: `http://mensajeria-api:3100` (red Docker `muchocodigo`) |
| `MENSAJERIA_CLAVE` | para mails | Clave del cliente (la clínica) en la mensajería (`mc_...`). Sin `MENSAJERIA_URL` y `MENSAJERIA_CLAVE`, MedCloud funciona pero no manda mails |
| `SOPORTE_EMAIL` | para soporte | Casilla que recibe los pedidos de la pantalla Soporte |
| `FRONTEND_URL` | sí | Base de los links de recuperación de contraseña. Sin ella, recuperar la contraseña falla |
| `BACKEND_URL` | sí | Base de los links firmados para confirmar o cancelar turnos desde el mail |

Para generar un `JWT_SECRET`:

```
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

> ⚠️ Cambiar `JWT_SECRET` cierra todas las sesiones abiertas e invalida los links de turnos de los mails ya enviados.

## Mensajería

MedCloud no manda mails por su cuenta: le pide cada envío a muchocodigo-mensajeria (`POST /v1/mensajes`) con una plantilla `medcloud/*` y sus datos. Los textos de los mails viven en el repo de la mensajería (`plantillas/medcloud/`).

En el servidor:
1. La mensajería y MedCloud se hablan por la red Docker `muchocodigo`. El servicio `backend` del compose de MedCloud tiene que estar en esa red, además de `medcloud-network`.
2. En la mensajería se da de alta el sistema `medcloud` (remitente, por ejemplo `turnos@avisos.test.medcloud.ar`), un cliente por clínica y su clave. Los comandos están en el manual técnico de la mensajería.
3. Se cargan las plantillas con `node scripts/plantillas-cargar.js --sistema medcloud`.

## Frontend

`frontend/.env.production` define la URL del backend (`REACT_APP_API_URL`; también se acepta `VITE_API_URL`). Si no está, `src/config.js` usa `https://api.medcloud.ar` fuera de localhost y `http://localhost:3000` en desarrollo.

## Puesta en marcha (desarrollo)

```
npm --prefix MedCloud-Backend install
npm --prefix MedCloud-Backend run dev
npm --prefix frontend install
npm --prefix frontend run dev
```

> ⚠️ Al arrancar, el backend inicia el scheduler de recordatorios. Si `MENSAJERIA_URL` y `MENSAJERIA_CLAVE` apuntan a la mensajería real, manda mails a los pacientes de la base configurada. En desarrollo, dejalas vacías o usá la mensajería con el proveedor `consola`.

## Despliegue

1. Antes de actualizar el código, revisar el compose del servidor:
   - que estén `JWT_SECRET` y `TZ`, porque sin ellos el backend no arranca o guarda mal las horas;
   - y, para mails, `MENSAJERIA_URL`, `MENSAJERIA_CLAVE` y `SOPORTE_EMAIL`.
2. `git pull` y `sudo docker compose up -d --build backend frontend`.
3. Verificar el ingreso con un usuario de cada rol.

Frontend y backend deben actualizarse juntos.
