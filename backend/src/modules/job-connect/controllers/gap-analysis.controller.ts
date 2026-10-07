import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { profileRequirementsSchema } from '../requests/profile-requirements.schema.js';
import { SchemaValidationPipe } from '../requests/schema-validation.pipe.js';
import { VacancyGapService } from '../services/vacancy-gap.service.js';

@Controller('job-connect/vacancies')
export class GapAnalysisController {
  constructor(private readonly service: VacancyGapService) {}

  @Post(':id/gap-analysis')
  @HttpCode(200)
  analyze(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new SchemaValidationPipe(profileRequirementsSchema))
    profile: ReturnType<typeof profileRequirementsSchema.parse>,
  ) {
    return this.service.analyze(id, profile);
  }
}
