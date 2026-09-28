## Description

This repository contains the backend for the **UMSSY** application.

## Project Setup

1. Install dependencies:

```bash
pnpm install
```

2. Environment configuration:
   Create a `.env` file by copying the template file:

```bash
cp .env.example .env
```

> **Note:** For local development, using the default values in `.env` is sufficient. Feel free to update the environment variables as needed.

## Compile and Run the Project

1. Start the required services via Docker:

```bash
docker compose up -d
```

2. Run the application in **watch mode** (automatically reloads the server when code changes are saved):

```bash
pnpm run start:dev
```

you can visit the Swagger documentation in:
```
http://localhost:8080/docs
```

and the server runs in:
```
http://localhost:8080/api
```

## Database Migrations

Ensure your database container is running before executing migration commands.

- **Apply existing migrations:**

```bash
pnpm migrate:apply
```

- **Generate a new migration** (if you modified `schema.prisma`):

```bash
pnpm migrate <migration_name>
```

- **Generate Prisma Client:**

```bash
pnpm generate
```

## Run Tests

```bash
# Unit tests
pnpm run test

# End-to-end (E2E) tests
pnpm run test:e2e

# Test coverage report
pnpm run test:cov

```
## Testing

   Antes de correr los tests, levanta la base de datos local con `docker compose up -d postgres` y aplica las migraciones a `.env` con `pnpm migrate:apply`.

   Luego crea un archivo `.env.test` copiando `.env.test.example`. Usa las mismas credenciales de tu `.env` (`DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT`) y deja `DB_SCHEMA=test`, para que los tests usen un schema separado y no afecten tus datos de desarrollo.

   Aplica las migraciones al schema de pruebas (solo la primera vez o cuando haya migraciones nuevas):

   pnpm exec dotenv run -f .env.test -- pnpm migrate:apply

## Resources

- [NestJS Documentation](https://docs.nestjs.com?utm_source=gemini) — Learn more about the framework.
- [NestJS Courses](https://courses.nestjs.com/?utm_source=gemini) — Official video courses for hands-on experience.
- [Prisma v7 Documentation](https://www.prisma.io/docs/orm/v7?utm_source=gemini) — Official ORM documentation.