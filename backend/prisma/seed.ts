import { runSeed } from '../src/common/database/seeds.js';

// La lógica vive en el orquestador de seeds (src/common/database/seeds.ts).
try {
  const summary = await runSeed();
  console.log('Seed completado:', JSON.stringify({ ...summary, weeks: undefined, plan: undefined }));
} catch (error) {
  console.error(error);
  process.exit(1);
}
