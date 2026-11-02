# Base de datos — objetos de MedCloud

El modelo está en [DER.md](DER.md). La mayoría de los procedimientos `sp_*` existen solo en la base de producción; se van
versionando acá a medida que se tocan (un archivo por objeto, `CREATE OR ALTER`, como en StockyApp).

## Reglas

- Un archivo por objeto en `procedures/` (más adelante `tables/`, `functions/`, `views/`).
- `CREATE OR ALTER`: el script se puede correr las veces que haga falta.
- Antes de cambiar un procedimiento que todavía no está acá, copiar su definición actual desde la base y versionarla tal
  cual en un commit aparte; recién después, el cambio.
- Los cambios deben ser compatibles con el backend y el frontend que están corriendo (por ejemplo, agregar columnas y no
  quitarlas), así se pueden aplicar antes de desplegar el código.

## Aplicar en el servidor

Con el script en el servidor (después del `git pull`), desde `~/MedCloud`:

```bash
docker exec -i medcloud-sql sh -c '/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -d MedCloud -b -i /dev/stdin' < database/procedures/<objeto>.sql
```

## Objetos versionados

| Objeto | Tipo | Uso |
|---|---|---|
| `sp_GetTurnos` | procedimiento | Agenda; devuelve `pagado` y `metodo_pago` además del comprobante |
