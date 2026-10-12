# MedCloud — Manual de uso

MedCloud es el sistema de gestión del consultorio: pacientes, agenda de turnos, historia clínica, caja diaria, cobros y liquidación de honorarios de los médicos.

## Cómo ingresar

1. Abrí MedCloud en el navegador.
2. Escribí tu **usuario** y tu **contraseña** y tocá **INGRESAR**.
3. Si es tu primer ingreso, el sistema te pide elegir una contraseña nueva.

El detalle está en [Ingreso y sesión](ingreso.md).

## Qué ve cada usuario

Cada usuario tiene un rol y ve solo lo que corresponde a su tarea:

| Rol | Qué puede hacer |
|---|---|
| Administrador | Todo: usuarios, roles, profesionales, pacientes, turnos, caja y liquidaciones |
| Recepción | Lo mismo que el administrador, salvo gestionar administradores y el rol de administrador |
| Médico | Su agenda, sus pacientes y la historia clínica. No ve cobros, caja ni liquidaciones |

Si intentás entrar a algo que tu rol no permite, aparece "No tenés permisos para realizar esta acción" o "Acceso Restringido".

## Pantallas

| Sección | Pantalla | Página |
|---|---|---|
| Acceso | Ingreso y sesión | [Ingreso y sesión](ingreso.md) |
| Atención | Pacientes | [Pacientes](pacientes.md) |
| | Turnos | [Turnos](turnos.md) |
| | Historia clínica | [Historia clínica](historia-clinica.md) |
| Administración | Profesionales | [Profesionales](profesionales.md) |
| | Usuarios y roles | [Usuarios y roles](usuarios-y-roles.md) |
| | Caja diaria | [Caja diaria](caja.md) |
| | Liquidaciones | [Liquidaciones](liquidaciones.md) |

## Novedades

- **10/10/2026**:
  - Más seguridad. Los estudios y recibos se abren solo con la sesión iniciada, en una pestaña nueva.
  - Cuando la sesión vence, el sistema te avisa y te lleva al ingreso.
  - Recepción ya no puede crear ni modificar administradores.
  - Se corrigió el borrado de pacientes, que mostraba un error aunque se borraba.
  - Se corrigieron los recibos que no abrían desde la agenda y las liquidaciones.
