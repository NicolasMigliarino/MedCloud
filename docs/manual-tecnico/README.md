# MedCloud — Manual técnico

MedCloud es un sistema web de gestión para clínicas y consultorios: pacientes, agenda de turnos, historia clínica, caja diaria, cobros y liquidación de honorarios médicos. Lo usan tres roles: **ADMIN**, **RECEPCION** y **MEDICO**.

El sistema tiene tres capas: un frontend en React (Vite) que corre en el navegador, una API en Node + Express y una base SQL Server donde vive la mayor parte de la lógica en procedimientos almacenados (`sp_*`). La API valida la sesión (JWT) y el rol en cada ruta antes de llamar al procedimiento.

| Documento | Contenido |
|---|---|
| [arquitectura.md](arquitectura.md) | Capas, carpetas, sesión y permisos, decisiones de diseño |
| [instalacion.md](instalacion.md) | Requisitos, variables de entorno, puesta en marcha y despliegue |
| [base-de-datos.md](base-de-datos.md) | Tablas y procedimientos que usa el backend y supuestos sobre ellos |
| [api.md](api.md) | Endpoints por módulo con el rol requerido y los errores |
| [modulos.md](modulos.md) | Archivos, permisos y reglas de cada módulo |
| [changelog.md](changelog.md) | Historial de cambios |

Convenciones del proyecto: los permisos del backend replican exactamente los del frontend (`ProtectedRoute` y botones ocultos por rol); ningún secreto se escribe en el código (todo por `.env`); cada cambio actualiza estos manuales y el changelog en el mismo commit.
