import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildDatabaseConnectionString } from '../../prisma/build-connection-string.js';

describe('buildDatabaseConnectionString', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.DB_USER = 'test_user';
    process.env.DB_PASSWORD = 'test_password';
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '5432';
    process.env.DB_NAME = 'test_db';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('construye la cadena de conexion PostgreSQL usando variables de entorno', () => {
    const connectionString = buildDatabaseConnectionString();
    expect(connectionString).toBe('postgresql://test_user:test_password@localhost:5432/test_db');
  });
});
