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

1. **Start the required services using Docker:**
To spin up all services—including the NestJS API and PostgreSQL database (API runs in **development mode** by default) and runs migrations too:
```bash
docker compose up -d
```


If you only need to run the PostgreSQL database (you need to run migrations after), run:
```bash
docker compose up postgres -d
```

2. **Start the application in development mode:**
Run the server in **watch mode** to enable auto-reloading whenever code changes are saved:
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

## Development Seed

Loads the test data used by the E2E tests (no mocks):

- The 5 `ROLE_NAMES` roles (`titulado`, `estudiante`, `mentor`, `empresa`,
  `administrativo`); the legacy `MENTOR` and `TITULADO` roles are deleted when
  nothing references them anymore.
- The Epic 1 provisional user (`prueba@umss.edu.bo`, `titulado` role) and
  4 test users under `@umssy.test`: 2 mentors, 1 graduate and 1 student, each
  with its role assigned and the password `Prueba123`.
- Availability blocks in the previous, current and next week, relative to the
  execution date and calculated in Bolivia time (UTC-4).
- One mentor with 50 blocks in a single week and another mentor with no blocks.
- One block already in the past within the current week.
- One free block plus one pending and one confirmed appointment, all scheduled
  after the execution time (the graduate is the one who books, as in HU-04).

```bash
# Runs `prisma db seed` against the database configured in .env
pnpm seed

# Runs the seed with the variables from .env.test
pnpm seed:test
```

Migrations and the seed use the schema from `DB_SCHEMA`, which is intentionally
absent from `.env.example`: keep `DB_SCHEMA=test` in your local `.env` (it is
already present in `.env.test.example`) so development data goes to the `test`
schema, while the application at runtime always connects to `public`.

The seed is **idempotent**: it runs inside a single transaction that first
removes the `@umssy.test` users it owns, so running it twice never duplicates
data. If anything fails, the transaction is rolled back.

> **Note:** this development seed (Epic #7, B-03) **replaces** the Epic 1 login
> seed in `prisma/seed.ts`: it keeps the Epic 1 roles and provisional user and
> adds the Epic 7 test data, so re-running it keeps both suites in sync.

## Run Tests

```bash
# Unit tests
pnpm run test

# End-to-end (E2E) tests
pnpm run test:e2e

# Run unit and E2E tests in parallel
pnpm run test:all

# Test coverage report
pnpm run test:cov
```
## Testing

Before running the tests, start the local database with `docker compose up -d postgres` and apply the migrations to `.env` with `pnpm migrate:apply`.

Then create a `.env.test` file by copying `.env.test.example`. Use the same credentials as your `.env` (`DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT`) and keep `DB_SCHEMA=test`, so tests use a separate schema and don't affect your development data.

   Apply the migrations to the test schema (only the first time, or when new migrations are added):

```bash
   pnpm migrate:test:apply
```

   ## Resources
- [NestJS Documentation](https://docs.nestjs.com?utm_source=gemini) — Learn more about the framework.
- [NestJS Courses](https://courses.nestjs.com/?utm_source=gemini) — Official video courses for hands-on experience.
- [Prisma v7 Documentation](https://www.prisma.io/docs/orm/v7?utm_source=gemini) — Official ORM documentation.