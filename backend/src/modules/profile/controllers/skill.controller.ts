import {
  Controller,
  Get,
  Query,
  StandardSchemaValidationPipe,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { ResponseInterceptor } from '../../../common/interceptors/response.interceptor.js';
import { buildRequestValidationException } from '../../../common/utils/build-request-validation-exception.js';
import {
  searchSkillsSchema,
  type SearchSkillsRequest,
} from '../requests/search-skills.request.js';
import type { SkillResponse } from '../responses/skill.response.js';
import { SkillService } from '../services/skill.service.js';

@ApiTags('skills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor)
@UsePipes(
  new StandardSchemaValidationPipe({
    exceptionFactory: buildRequestValidationException,
  }),
)
@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiOkResponse({ description: 'Skills of the catalog that match the search' })
  listCatalog(
    @Query({ schema: searchSkillsSchema }) request: SearchSkillsRequest,
  ): Promise<SkillResponse[]> {
    return this.skillService.listCatalog(request);
  }
}
