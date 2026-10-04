# JobConnect — #223, #233 y #283

Backend registrado en AppModule, con vacantes almacenadas en PostgreSQL.
El diccionario inicial es ampliable; no es un catálogo oficial UMSS ni usa una API externa.

| Endpoint | Entrada | Resultado |
|---|---|---|
| GET /api/job-connect/vacancies | page=1&limit=20 (máximo 100) | Vacantes activas no vencidas, ordenadas por creación |
| POST /api/job-connect/skills/extract | {"text":"Python en San Simón"} | {"skills":["Python"],"institutions":["UMSS"]} |
| POST /api/job-connect/vacancies/:id/gap-analysis | {"skills":["python"],"academicQualifications":[],"submittedRequirements":[]} | Requisitos con estado Cumple o Pendiente, missingSkills, complete y mensaje |

El análisis recibe el perfil actualizado del consumidor; no modifica ni certifica sus datos.
Normaliza mayúsculas, acentos y espacios, sin inferir títulos ni equivalencias académicas.
La extracción reconoce términos del diccionario, no negaciones. Las instituciones no son habilidades.
La validación devuelve 400 ante entradas inválidas; una vacante inexistente o inactiva devuelve 404.

Desde backend: `pnpm exec prisma migrate deploy --config prisma7.config.ts` aplica la migración.
`pnpm build`, `pnpm test` y `pnpm start:dev` generan el cliente Prisma automáticamente.
El cliente nuevo se genera en src/generated/prisma, excluido de Git; src/prisma es el cliente histórico del repositorio y ya no se importa.
Para otros comandos, ejecutar primero `pnpm generate`. No se crean ofertas de ejemplo.
