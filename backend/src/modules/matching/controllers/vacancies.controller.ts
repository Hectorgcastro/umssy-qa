import { Controller, Get, Param, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CurrentUserId } from '../../../common/decorators/current-user-id.decorator.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { ResponseInterceptor } from '../../../common/interceptors/response.interceptor.js';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import { analyzeExperienceParamsSchema } from '../requests/analyze-experience.schema.js';
import { vacanciesQuerySchema } from '../requests/vacancies-query.schema.js';
import { VacanciesService } from '../services/vacancies.service.js';

@Controller('vacancies')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor)
export class VacanciesController {
  constructor(private readonly service: VacanciesService) {}

  @Get()
  findRecommended(@CurrentUserId() userId: string, @Query(new ZodValidationPipe(vacanciesQuerySchema)) query: { page: number; limit: number }) {
    return this.service.findRecommended(userId, query.page, query.limit);
  }

  @Get(':id')
  findDetail(@CurrentUserId() userId: string, @Param(new ZodValidationPipe(analyzeExperienceParamsSchema)) params: { id: string }) {
    return this.service.findDetail(userId, params.id);
  }
}
