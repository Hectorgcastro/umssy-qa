# Diseño de base de datos de Epic 5

Esta rama publica el diseño para revisión. No modifica el esquema Prisma que ejecuta la aplicación ni aplica migraciones al abrir o clonar el repositorio.

## Archivos

- `postulaciones-er-design.sql`: script de revisión para Supabase, limitado a `er_design`. Requiere `er_design.users` con identificador UUID; crea `vacancies` si falta y las tablas `application_statuses`, `vacancy_applications`, `application_histories` y `saved_vacancies`. Ejecutar una sola vez desde SQL Editor. Si ya existen, revisar su estructura antes de repetir el script.
- `postulaciones-local.sql`: SQL aplicado a nuestra base local. Requiere las tablas `users` y `vacancies` del proyecto. Se publica como referencia, no como migración activa de esta rama.
- `schema-local-reference.prisma`: copia del esquema local completo, con las propuestas de postulaciones y favoritas. Incluye cambios locales que todavía no necesariamente están integrados en `develop`; no reemplazar el esquema de la aplicación con este archivo sin revisar las dependencias.

## Relaciones y reglas

Una postulación relaciona usuario, vacante y estado. Solo se permite una por usuario y vacante. El historial registra cambios de estado y el usuario que los realizó. Las favoritas también impiden duplicados por usuario y vacante.

Los estados iniciales son `submitted`, `under_review`, `accepted` y `rejected`. El historial no se registra automáticamente: el servicio de postulaciones deberá guardar el cambio y su historial en una transacción. Las pantallas y endpoints de este flujo aún no están implementados.

En Supabase, el esquema de revisión usa RLS en las cuatro tablas nuevas y no define políticas para clientes. Está destinado a revisión desde el dashboard, no a acceso directo desde el frontend.

No se incluyen credenciales, archivos `.env`, usuarios reales ni copias de datos. Antes de integrar el diseño al backend compartido, acordar el esquema de destino y generar su migración correspondiente desde el esquema aprobado del equipo.
