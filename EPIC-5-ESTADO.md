# Epic 5 — revisión e implementación local

Fecha: 6 de octubre de 2026. Repositorio: [UMSSY/umssy-app](https://github.com/UMSSY/umssy-app).

La revisión cubre las 19 tareas de las historias de extracción NLP, recomendaciones, compatibilidad y requisitos faltantes. El estado del issue no demuestra por sí solo que una funcionalidad esté integrada. Se encontraron servicios incompletos, ramas sin cambios propios y componentes con datos de ejemplo; también existían implementaciones en ramas pendientes de integrar. No se atribuye falta de trabajo a una persona por esos estados.

## Código listo para revisar

La rama local `fix/grupo-5-epic-5-validation` contiene el conjunto integrado y validado. Incluye la sincronización de `develop` con la épica, conservando ambos conjuntos de módulos.

Las 16 ramas nuevas son una cadena de tareas: cada una parte de la anterior porque los cambios comparten dependencias. Para revisar solo una tarea, comparar con su rama precedente; el primer punto de partida es `fix/grupo-5-local-integration`. No fusionar todas contra la épica simultáneamente sin resolver estas dependencias. Los ajustes de integración y el cliente Prisma regenerado están en la rama final de validación.

No se han publicado ramas ni cambiado responsables, estados o PRs en GitHub. Las ramas originales del equipo permanecen disponibles.

| Orden | Issue / tarea | Estado en GitHub | Responsable actual | Rama local |
| --- | --- | --- | --- | --- |
| Existente | [#200 Normalización](https://github.com/UMSSY/umssy-app/issues/200) | Cerrado | juandiego-collab | `feature/grupo-5-backend-nlp-normalization` |
| Existente | [#208 Tokenización](https://github.com/UMSSY/umssy-app/issues/208) | Abierto | juandiego-collab | `feature/grupo-5-backend-nlp-tokenization` |
| Existente | [#209 N-gramas](https://github.com/UMSSY/umssy-app/issues/209) | Cerrado | juandiego-collab | `feature/grupo-5-backend-nlp-ngrams` |
| 1 | [#223 Diccionario UMSS](https://github.com/UMSSY/umssy-app/issues/223) | Cerrado | jhoan777 | `feature/grupo-5-task-223-umss-dictionary` |
| 2 | [#215 Comparador de habilidades](https://github.com/UMSSY/umssy-app/issues/215) | Abierto | urielrfs22 | `feature/grupo-5-task-215-skills-classifier` |
| 3 | [#233 Vacantes activas](https://github.com/UMSSY/umssy-app/issues/233) | Abierto | jhoan777 | `feature/grupo-5-task-233-active-vacancies` |
| 4 | [#283 Gap Analysis](https://github.com/UMSSY/umssy-app/issues/283) | Abierto | jhoan777 | `feature/grupo-5-task-283-gap-analysis` |
| 5 | [#275 Fórmula ponderada](https://github.com/UMSSY/umssy-app/issues/275) | Abierto | urielrfs22 | `feature/grupo-5-task-275-match-score` |
| 6 | [#235 Matching lógico](https://github.com/UMSSY/umssy-app/issues/235) | Abierto | juandiego-collab | `feature/grupo-5-task-235-matching-core` |
| 7 | [#236 Ordenamiento](https://github.com/UMSSY/umssy-app/issues/236) | Abierto | urielrfs22 | `feature/grupo-5-task-236-ranking` |
| 8 | [#189 Endpoint y persistencia](https://github.com/UMSSY/umssy-app/issues/189) | Cerrado | urielrfs22 | `feature/grupo-5-task-189-persist-experience-skills` |
| 9 | [#221 Chips](https://github.com/UMSSY/umssy-app/issues/221) | Abierto | Fertv10 | `feature/grupo-5-task-221-experience-chips` |
| 10 | [#276 Barra de compatibilidad](https://github.com/UMSSY/umssy-app/issues/276) | Abierto | DataSquad07 | `feature/grupo-5-task-276-compatibility-bar` |
| 11 | [#284 Semáforo de requisitos](https://github.com/UMSSY/umssy-app/issues/284) | Abierto | Fertv10 | `feature/grupo-5-task-284-missing-requirements` |
| 12 | [#239 Vista de vacantes](https://github.com/UMSSY/umssy-app/issues/239) | Abierto | jercho0210-cpu | `feature/grupo-5-task-239-recommended-vacancies` |
| 13 | [#264 QA de matching](https://github.com/UMSSY/umssy-app/issues/264) | Abierto | estherunosoto | `test/grupo-5-task-264-matching-qa` |
| 14 | [#277 Estrés matemático](https://github.com/UMSSY/umssy-app/issues/277) | Abierto | CelinaAleidaLimaVeizaga | `test/grupo-5-task-277-score-stress` |
| 15 | [#285 Estados de UI](https://github.com/UMSSY/umssy-app/issues/285) | Abierto | estherunosoto | `test/grupo-5-task-285-zero-gap-ui` |
| 16 | [#222 Rendimiento y persistencia](https://github.com/UMSSY/umssy-app/issues/222) | Abierto | CelinaAleidaLimaVeizaga | `test/grupo-5-task-222-nlp-performance` |

## Comportamiento implementado

- El NLP conecta normalización, stopwords, n-gramas, excepciones UMSS y un diccionario inicial de habilidades. No convierte instituciones o adjetivos comunes en habilidades. Reconoce C++, C#, .NET y Node.js sin confundir este último con JavaScript.
- Guardar o editar una experiencia persiste sus etiquetas en la misma escritura de base de datos. Vaciar la descripción elimina esas etiquetas. El endpoint de análisis exige sesión y propiedad de la experiencia, y rechaza textos o ediciones concurrentes incompatibles.
- Los chips usan respuestas reales, aparecen después de guardar, al editar y en el listado de experiencias; los datos de ejemplo fueron retirados del inicio.
- Las recomendaciones consultan vacantes activas y no vencidas y el perfil del usuario autenticado. La paginación ocurre después del ordenamiento por carrera, experiencia y habilidades. Los empleos simultáneos no duplican años de experiencia.
- La compatibilidad pondera habilidades 60, formación 25, experiencia 10 y otros requisitos 5, excluyendo categorías sin requisitos. La fórmula y sus decisiones están en `backend/src/modules/matching/README.md`.
- `/vacantes` y `/vacantes/[id]` usan la API, con porcentaje entero, barra accesible, semáforo textual Cumple/Pendiente, estados de carga/error/vacío, paginación y enlace Volver. Los resultados se vuelven a consultar al regresar o recuperar el foco.

## Validación

- Backend: compilación y 826 pruebas unitarias aprobadas en 115 archivos.
- Frontend: 63 pruebas de las áreas modificadas aprobadas; tipos y compilación de producción aprobados. No se ejecutó toda la suite de frontend.
- ESLint de los módulos modificados aprobado en ambos proyectos.
- Ocho migraciones aplicadas y seeds del proyecto ejecutados en una base nueva de uso universitario.
- Quince comprobaciones reales de API aprobadas: login, sesión obligatoria, paginación inválida, vacantes vencidas/inactivas, escritura de etiquetas, acceso de otro usuario rechazado, texto obsoleto rechazado, recálculo de porcentaje y limpieza de descripción. La creación con análisis respondió en menos de 2.5 segundos.
- La vista `/vacantes` respondió HTTP 200. No se realizó una revisión visual manual en navegador.

## Entorno local

Abrir `E:\SistemaISP\UMSSY.code-workspace` o la carpeta `E:\SistemaISP\umssy-app` en VS Code.

- Frontend: http://localhost:3001/vacantes
- Backend: http://localhost:8080/api
- Swagger: http://localhost:8080/docs
- Base de datos universitaria: `umssy_epic5_20261006`.
- Usuario de prueba del seed: `prueba@umss.edu.bo`, contraseña `Prueba123`, rol Titulado.

Las credenciales de conexión y el secreto JWT están en archivos de entorno locales ignorados por Git. La base de datos del sistema ISP no fue modificada. La caché de instalación se ubicó en E: porque C: estaba casi lleno.

Para iniciar de nuevo, ejecutar `npm run start:dev` en backend y `npm run dev -- --port 3001` en frontend. Antes de compilar una rama con cambios de esquema, generar Prisma con `node node_modules/prisma/build/index.js generate --config prisma7.config.ts`.

## Integración pendiente y límites

- El [PR #573](https://github.com/UMSSY/umssy-app/pull/573) permanece abierto y con conflictos. No fue modificado. Contiene trabajo previo de #223, #233 y #283; revisar duplicados y migraciones antes de integrarlo junto con estas ramas. La implementación local de `matching` consolida esas capacidades, por lo que no conviene registrar simultáneamente el antiguo módulo `job-connect` sin reconciliación.
- No existe aún un flujo de documentos presentados por oportunidad en el esquema compartido. Los otros requisitos se muestran como pendientes cuando no hay evidencia; no se infiere que una carta fue presentada por tener un CV o una certificación. Ese flujo requiere una tarea adicional si se desea aceptar documentos.
- El diccionario de habilidades es un vocabulario inicial, no un catálogo exhaustivo. Se puede extender con términos validados.
- La instalación necesitó npm con `--legacy-peer-deps --package-lock=false --ignore-scripts`: la versión pnpm 12.4.2 configurada no pudo ejecutarse, pnpm 10 rechazó los lockfiles y `nestjs-zod` declara compatibilidad con NestJS 10/11 mientras el proyecto usa 12. No se cambiaron versiones ni lockfiles.
- Los checks locales no sustituyen la revisión y el CI del repositorio. Las historias y tareas no se han cerrado en GitHub.
