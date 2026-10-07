import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { vacanciesQuerySchema } from '../requests/vacancies-query.schema.js';
import { SchemaValidationPipe } from '../requests/schema-validation.pipe.js';
import { VacanciesService } from '../services/vacancies.service.js';

@Controller('job-connect/vacancies')
export class VacanciesController {
  constructor(private readonly vacancies: VacanciesService) {}

  @Get()
  findActive(
    @Query(new SchemaValidationPipe(vacanciesQuerySchema))
    query: ReturnType<typeof vacanciesQuerySchema.parse>,
  ) {
    return this.vacancies.findActive(query.page, query.limit);
  }
}
