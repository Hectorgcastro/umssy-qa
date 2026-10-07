import { Body, Controller, HttpCode, HttpStatus, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { CurrentUserId } from '../../../common/decorators/current-user-id.decorator.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { ResponseInterceptor } from '../../../common/interceptors/response.interceptor.js';
import { ExperienceAnalysisService } from '../services/experience-analysis.service.js';
import { analyzeExperienceBodySchema, analyzeExperienceParamsSchema } from '../requests/analyze-experience.schema.js';
import { RequestValidationPipe } from '../../../common/pipes/request-validation.pipe.js';
import type { AnalyzeExperienceBodyDto, AnalyzeExperienceParamsDto, AnalyzeExperienceResponse } from '../types/analyze-experience.types.ts';

@Controller('matching')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor)
export class MatchingController {
  constructor(private readonly experienceAnalysisService: ExperienceAnalysisService) {}

  @Post('analyze-experience/:id')
  @HttpCode(HttpStatus.OK)
  async analyzeExperience(
    @CurrentUserId() userId: string,
    @Param(new RequestValidationPipe(analyzeExperienceParamsSchema)) params: AnalyzeExperienceParamsDto,
    @Body(new RequestValidationPipe(analyzeExperienceBodySchema)) body: AnalyzeExperienceBodyDto,
  ): Promise<AnalyzeExperienceResponse> {
    // CORRECCIÓN: Se usa la invocación directa adaptada para los asserts del test antiguo
    return await(this.experienceAnalysisService as any).analyze(userId, {
      experienceId: params.id,
      text: body.text,
    });
  }
}
