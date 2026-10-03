export function buildDatabaseConnectionString(): string {
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const name = process.env.DB_NAME;

  return `postgresql://${user}:${password}@${host}:${port}/${name}`;
}
