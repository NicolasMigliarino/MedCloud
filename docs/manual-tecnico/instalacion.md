# Instalación

Requisitos: Node 20 o superior, SQL Server con la base `MedCloud` y sus procedimientos `sp_*`, y una cuenta SMTP para los correos.

## Variables de entorno del backend

Se configuran en `MedCloud-Backend/.env` (no se versiona). La plantilla es `MedCloud-Backend/.env.example`.

| Variable | Obligatoria | Uso |
|---|---|---|
| `PORT` | no | Documentada; hoy el servidor escucha fijo en 3000 |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_ENCRYPT` | sí | Conexión a SQL Server (`src/db.js`) |
| `JWT_SECRET` | **sí** | Firma de las sesiones. Mínimo 32 caracteres; sin ella el servidor no arranca |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | sí | Envío de recordatorios, agendas, soporte y recuperación de contraseña |
| `FRONTEND_URL` | sí | Base de los links de recuperación de contraseña |
| `BACKEND_URL` | sí | Base de los links de confirmación de turnos en los mails |

Para generar un `JWT_SECRET`:

```
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

> ⚠️ Cambiar `JWT_SECRET` cierra todas las sesiones abiertas: los usuarios tienen que volver a ingresar una vez.

## Frontend

`frontend/.env.production` define la URL del backend (`REACT_APP_API_URL`; también se acepta `VITE_API_URL`). Si no está, `src/config.js` usa `https://api.medcloud.ar` fuera de localhost y `http://localhost:3000` en desarrollo.

## Puesta en marcha (desarrollo)

```
npm --prefix MedCloud-Backend install
npm --prefix MedCloud-Backend run dev
npm --prefix frontend install
npm --prefix frontend run dev
```

> ⚠️ Al arrancar, el backend inicia el scheduler de recordatorios y manda mails reales a los pacientes de la base configurada. No levantarlo apuntando a la base de producción salvo en el servidor de producción.

## Despliegue

1. Agregar `JWT_SECRET` al `.env` del servidor **antes** de actualizar el código (si falta, el backend no arranca).
2. `npm --prefix MedCloud-Backend install` (instala `jsonwebtoken`, ahora declarada como dependencia).
3. `npm --prefix frontend run build` y publicar `frontend/dist`.
4. Reiniciar el backend y verificar el ingreso con un usuario de cada rol.

Frontend y backend deben actualizarse juntos: el frontend nuevo abre los archivos con sesión y usa `GET /historial/paciente/:id`.
