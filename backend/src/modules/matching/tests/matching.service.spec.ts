import { describe, it, expect } from 'vitest';

interface RequirementGapResult {
  totalRequired: number;
  matchedCount: number;
  gapCount: number;
  isZeroGap: boolean;
  message: string;
}

interface CareerMatchingInput {
  requiredCareers: string[];
  candidateCareer: string;
}

// Lógica de análisis de brechas de habilidades
function analyzeRequirementsGap(
  requiredSkills: string[],
  candidateSkills: string[]
): RequirementGapResult {
  const missingSkills: string[] = requiredSkills.filter(
    (skill) => !candidateSkills.includes(skill)
  );

  const gapCount = missingSkills.length;
  const isZeroGap = gapCount === 0;

  return {
    totalRequired: requiredSkills.length,
    matchedCount: requiredSkills.length - gapCount,
    gapCount,
    isZeroGap,
    message: isZeroGap
      ? 'El perfil cubre la totalidad de los requisitos.'
      : `El perfil presenta una brecha de ${gapCount} requisito(s) faltante(s).`,
  };
}

// Lógica para evaluación de coincidencias de carreras (evita falsos positivos)
function evaluateCareerMatch(input: CareerMatchingInput): boolean {
  if (!input.requiredCareers || input.requiredCareers.length === 0) {
    return true; // Si no exige carreras específicas, es apto
  }
  
  if (!input.candidateCareer || input.candidateCareer.trim() === '') {
    return false; // Si exige carrera y el candidato no especifica, no hace match
  }

  const normalizedCandidate = input.candidateCareer.trim().toLowerCase();
  
  return input.requiredCareers.some(
    (career) => career.trim().toLowerCase() === normalizedCandidate
  );
}

describe('Matching Gap Analysis QA Suite - Zero Gap UI Behavior', () => {
  it('debe validar que cuando la brecha es igual a cero, se genere el mensaje explícito para la UI', () => {
    const requiredSkills: string[] = ['TypeScript', 'NestJS', 'PostgreSQL'];
    const candidateSkills: string[] = ['TypeScript', 'NestJS', 'PostgreSQL', 'Docker'];

    const result: RequirementGapResult = analyzeRequirementsGap(
      requiredSkills,
      candidateSkills
    );

    expect(result.gapCount).toBe(0);
    expect(result.isZeroGap).toBe(true);
    expect(result.message).toBe('El perfil cubre la totalidad de los requisitos.');
  });
});

describe('Matching QA Asserts - Prevención de Falsos Positivos de Carreras', () => {
  it('debe rechazar el match cuando la carrera del candidato no coincide con ninguna carrera requerida', () => {
    const isMatch = evaluateCareerMatch({
      requiredCareers: ['Ingeniería de Sistemas', 'Ingeniería Informática'],
      candidateCareer: 'Ingeniería Comercial',
    });

    expect(isMatch).toBe(false);
  });

  it('debe aprobar el match únicamente cuando la carrera coincide exactamente (ignorando mayúsculas/espacios)', () => {
    const isMatch = evaluateCareerMatch({
      requiredCareers: ['Ingeniería de Sistemas', 'Ingeniería Informática'],
      candidateCareer: '  ingeniería de sistemas  ',
    });

    expect(isMatch).toBe(true);
  });

  it('no debe dar falso positivo si el perfil del candidato no especifica carrera', () => {
    const isMatch = evaluateCareerMatch({
      requiredCareers: ['Ingeniería de Sistemas'],
      candidateCareer: '',
    });

    expect(isMatch).toBe(false);
  });
});