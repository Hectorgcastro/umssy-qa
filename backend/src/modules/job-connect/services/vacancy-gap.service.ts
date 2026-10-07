import { Injectable, NotFoundException } from '@nestjs/common';
import { VacanciesRepository } from '../repositories/vacancies.repository.js';
import { GapAnalysisService } from './gap-analysis.service.js';
import type { profileRequirementsSchema } from '../requests/profile-requirements.schema.js';

@Injectable()
export class VacancyGapService {
  constructor(
    private readonly repository: VacanciesRepository,
    private readonly gap: GapAnalysisService,
  ) {}

  async analyze(
    id: string,
    profile: ReturnType<typeof profileRequirementsSchema.parse>,
  ) {
    const vacancy = await this.repository.findActiveById(id);
    if (!vacancy) throw new NotFoundException('Vacante activa no encontrada');
    return { vacancyId: id, ...this.gap.analyze(vacancy, profile) };
  }
}
