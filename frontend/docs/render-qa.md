# Demo QA de Épica 8 en Render

Configuración preparada el 7 de octubre de 2026. No crea servicios ni ejecuta migraciones o seed.
Base revisada: epic/grupo-8-eventos-pases-offline, commit 5f755073152a2e83408408324fec0a6ade261f5e.
Integrar la rama de tarea mediante PR hacia la épica antes de publicar. Registrar el SHA final.

## Resultado local antes de modificar código

Docker umssy-db healthy, PostgreSQL 18.6, puerto 5432 y conexión autenticada.
Backend real en 8080: listado 200 (tres talleres), categorías 200 (Tecnología), detalle 200,
UUID inexistente 404 e ID inválido 400. CORS permite http://localhost:3000.
Frontend en 3000: detalle NestJS con Aula 101, Instructor Demo, 1/30 y 29 cupos;
Prisma lleno 1/1, botón Inscribirme deshabilitado. El botón disponible sigue siendo visual.
BD local: cinco migraciones antiguas aplicadas, cinco nuevas pendientes; no se aplicaron.
btree_gist disponible, trusted, no instalado; usuario local con CREATE y superusuario.
Esta validación corresponde al checkout local 566ad9d, no al runtime completo de la épica remota.

## Tres servicios separados

Usar dos Web Services Node y una Render Postgres nueva y exclusiva de QA, en la misma región.
No usar Compose ni el Dockerfile existente: su CMD ejecuta migraciones automáticamente.
No vincular ninguna BD compartida o de producción. Mantener Auto-Deploy desactivado para la demo.

| Ajuste | Frontend | Backend | PostgreSQL |
| --- | --- | --- | --- |
| Rama | epic/grupo-8-eventos-pases-offline | epic/grupo-8-eventos-pases-offline | No aplica |
| Root Directory | frontend | backend | No aplica |
| Runtime | Node 22; pnpm 12.4.2 | Node 22; pnpm 12.4.2 | PostgreSQL 18 |
| Build | corepack enable && corepack prepare pnpm@12.4.2 --activate && pnpm install --frozen-lockfile && pnpm build | corepack enable && corepack prepare pnpm@12.4.2 --activate && pnpm install --frozen-lockfile && pnpm generate && pnpm build | Gestionado por Render |
| Start | pnpm start --hostname 0.0.0.0 --port $PORT | pnpm start:prod | Gestionado por Render |
| Health Check | /events | /api | Gestionado por Render |
| Pre-Deploy | Vacío | Vacío | No aplica |

Los comandos del panel se ejecutan en Linux. PORT lo proporciona Render.
Añadir NODE_VERSION=22 a ambos Web Services. packageManager fija pnpm en ambos manifiestos.
El health check /api confirma HTTP, no sustituye la consulta real de talleres contra BD.

## Variables (sin secretos en el repositorio)

Frontend:
- NODE_VERSION=22
- NEXT_PUBLIC_APP_ENV=dev
- NEXT_PUBLIC_API_URL_DEV=https://<backend>.onrender.com/api

Backend:
- NODE_VERSION=22
- NODE_ENV=production
- DB_HOST: host interno de la BD nueva de Render
- DB_PORT: puerto mostrado por Render
- DB_NAME: nombre de la BD QA nueva
- DB_USER y DB_PASSWORD: credenciales de esa BD; guardarlas solo en Render
- DB_SCHEMA=public
- JWT_SECRET: secreto propio de QA; guardar solo en Render
- JWT_EXPIRES_IN=8h
- JWT_ALGORITHM=HS256
- CORS_ORIGIN=https://<frontend>.onrender.com
- PORT: dejar el valor asignado por Render

El proyecto consume DB_*; no consume DATABASE_URL. Usar host interno desde el backend.
La URL pública del backend incluye /api; el origen de CORS no incluye rutas ni barra final.
NEXT_PUBLIC_* se incorpora al build: reconstruir frontend al cambiar la URL.
No confiar en CI=true: el fallback de API en CI es localhost.
Usar public en una BD dedicada: runtime actual no implementa DB_SCHEMA personalizado.
La aplicación conserva su política TLS existente para hosts remotos; requiere revisión de DevOps
si se exige verificación de certificados. No se cambia esa política en esta tarea.

## Creación manual en Render

1. Revisar y fusionar el PR de tarea hacia la épica; comprobar CI del SHA final.
2. New > PostgreSQL. Nombre identificable como umssy-grupo8-qa; versión 18;
   misma región que el backend; crear una BD nueva. Elegir Free solamente si está disponible.
   No seleccionar un plan de pago sin autorización. Copiar metadatos de conexión sin publicarlos.
3. Conectarse a esa BD usando la conexión externa para comprobaciones desde la PC,
   sin reutilizar el .env de desarrollo. Ingresar secretos mediante el entorno local seguro,
   nunca como argumentos de shell, archivos versionados o capturas.
4. Confirmar nombre/propietario de BD, que no tiene tablas de aplicación y que es exclusiva de QA.
   Verificar PostgreSQL y btree_gist con las consultas de la sección siguiente.
5. Ejecutar manualmente migraciones y seed UNA VEZ, solo tras confirmar el destino nuevo.
   Free no tiene Shell ni one-off jobs: esta operación se realiza desde el checkout local.
6. New > Web Service para backend. Repo UMSSY/umssy-app; rama épica; root backend;
   runtime Node; comandos y variables de la tabla. No usar vercel-build ni migrate:apply en el build.
   Una vez conocida la URL del futuro frontend, establecer CORS_ORIGIN con su origen exacto.
7. New > Web Service para frontend. Mismo repo/rama; root frontend; runtime Node;
   configurar la URL pública real del backend antes del build. No elegir Static Site.
8. Ajustar CORS_ORIGIN si la URL final difiere; redesplegar backend.
   Si cambia la URL del backend, actualizar NEXT_PUBLIC_API_URL_DEV y reconstruir frontend.
9. Abrir ambos servicios para calentarlos antes de la demo; ejecutar la aceptación completa.

## PostgreSQL y permisos

Render soporta PostgreSQL 18 y btree_gist. La extensión es trusted en PostgreSQL 18;
un usuario sin superusuario puede instalarla con CREATE sobre la BD.
El rol que aplica migraciones también debe poder crear objetos en public y alterar las tablas
que crea. Comprobar esos permisos reales en Render; los privilegios locales no los prueban.
La migración 20261003140000 ya contiene CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public.
No es necesario cambiar migraciones para el proveedor.

Consultas de SOLO LECTURA antes de autorizar la preparación:

```sql
SELECT version(), current_database(), current_user, current_schema();
SELECT name, default_version, installed_version
FROM pg_available_extensions WHERE name = 'btree_gist';
SELECT name, version, superuser, trusted
FROM pg_available_extension_versions WHERE name = 'btree_gist';
SELECT has_database_privilege(current_user, current_database(), 'CREATE') AS database_create,
       has_schema_privilege(current_user, 'public', 'USAGE') AS schema_usage,
       has_schema_privilege(current_user, 'public', 'CREATE') AS schema_create;
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

## Migraciones y seed controlados: NO ejecutados en esta tarea

En un checkout limpio del SHA final, desde backend, cargar DB_* de la BD QA confirmada.
Para conexión desde la PC usar el host externo de esa MISMA BD; en Render usar el interno.
Comprobar pg_isready o conexión SELECT 1 y las consultas anteriores antes de continuar.

```bash
pnpm install --frozen-lockfile
pnpm generate
pnpm exec prisma migrate status --config prisma7.config.ts
# Solo tras confirmar explícitamente la BD QA nueva y vacía:
pnpm exec prisma migrate deploy --config prisma7.config.ts
pnpm seed:run
```

El seed de la épica abarca varios equipos y actualiza usuarios/roles/disponibilidad;
no se debe ejecutar sobre la BD local existente ni la compartida.
No se ejecuta automáticamente en build, start, pre-deploy ni health checks.
Para cambios posteriores: revisar cada migración y el destino antes de ejecutar manualmente;
no repetir seed como parte del arranque habitual.

## Aceptación de QA

- GET /api/events?page=1&limit=10: 200, data.items y paginación.
- GET /api/event-categories: 200. En BD limpia con seed actual: cuatro categorías, siete talleres.
- GET /api/events/33333333-3333-3333-3333-333333333331: 200, NestJS, 1/30, 29 cupos.
- GET /api/events/33333333-3333-3333-3333-333333333332: 200, Prisma lleno 1/1, cero cupos.
- GET /api/events/99999999-9999-4999-8999-999999999999: 404 si no existe; ok=false y data=null.
- GET /api/events/123: 400 por GUID inválido.
- Desde otra computadora abrir https://<frontend>/events; seleccionar NestJS y Prisma.
  Confirmar campos reales, ausencia de errores CORS/contenido mixto y peticiones a HTTPS público.
- Inscribirme: lleno deshabilitado; disponible visual. Al pulsarlo no debe salir POST de inscripción
  ni cambiar el conteo de registros. Revisar Network y volver a consultar detalle.
- Listado/detalle no requieren autenticación. Para Mis pases usar prueba@umss.edu.bo, rol titulado,
  y sinpases@umss.edu.bo para vacío. Obtener contraseña del mecanismo de seed por canal privado.

Diagnóstico de fallos: contenedor apagado o pg_isready falla -> servicio; conexión rechazada ->
puerto/host; 28P01 -> credenciales; 3D000 -> BD incorrecta/inexistente; 42P01/P2021 -> tablas/schema;
listado 200 vacío -> datos o filtro Publicado; detalle 404 -> ID inexistente, no fallo de conexión.
CORS bloqueado con API 200 desde terminal -> origen incorrecto; frontend sin peticiones válidas ->
URL incorporada al build. No solucionar datos ausentes ejecutando seed sobre una BD no confirmada.

## Límites y costos consultados el 7 de octubre de 2026

Free puede cubrir dos Web Services y una Postgres por USD 0, sujeto a disponibilidad/cuotas:
750 horas mensuales compartidas por workspace entre Web Services, no 750 por servicio;
ambos activos continuamente exceden esa bolsa. Duermen tras 15 minutos sin tráfico;
el despertar tarda aproximadamente un minuto y puede superar el timeout del cliente.
Free Postgres: una por workspace, 1 GB, expira a los 30 días; sin backups gestionados.
Free Web Services: sin Shell, one-off jobs, pre-deploy ni disco persistente.
Los archivos locales son efímeros. No demostrar almacenamiento de documentos de otras épicas.

Referencia de compute publicado: Web Service 512 MB/0.5 CPU USD 7/mes cada uno;
Postgres 256 MB/0.1 CPU USD 6/mes: USD 20/mes de compute para los tres, más almacenamiento PostgreSQL a USD 0.30/GB/mes,
uso adicional e impuestos aplicables. Confirmar nombres de planes y total en el panel;
Render cambió IDs de planes en agosto de 2026. Esta guía no autoriza contratar esos planes.
Cuotas de transferencia y minutos de build son compartidas y dependen del workspace;
con tarjeta puede haber cobros adicionales, sin ella puede haber suspensión al agotar cuotas.

Fuentes oficiales:
- https://render.com/docs/free
- https://render.com/pricing
- https://render.com/docs/compute-plans
- https://render.com/docs/postgresql-creating-connecting
- https://render.com/docs/postgresql-extensions
- https://render.com/docs/deploy-nextjs-app
- https://render.com/docs/deploys
- https://www.postgresql.org/docs/18/btree-gist.html

## Pendientes e intervención de DevOps

Pendientes: URLs de los servicios, BD QA nueva, permisos efectivos y aplicación manual de sus
migraciones/seed, validación del runtime completo del SHA final y prueba desde otra computadora.
El check CI Files del commit base falla por cambios de configuración fuera de ramas DevOps.
Este PR no modifica .github, scripts compartidos, tsconfig, vitest, eslint, Compose ni Dockerfile.
Si el PR muestra ese check por cambios heredados, DevOps debe resolver el flujo de integración;
no se debe desactivar el control. Inscribirme sigue visual; service worker aún no implementa caché offline.