import { Injectable } from '@nestjs/common';
import { VacanciesRepository } from '../repositories/vacancies.repository.js';

@Injectable()
export class VacanciesService {
  constructor(private readonly repository: VacanciesRepository) {}

  findActive(page: number, limit: number) {
    return this.repository.findActive(page, limit);
  }
}
