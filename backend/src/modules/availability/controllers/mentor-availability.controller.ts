import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator.js';
import { ProvisionalSessionGuard } from '../../../common/guards/provisional.guard.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import { FIND_MENTOR_FREE_BLOCKS_DOCS } from '../constants/availability-docs.constants.js';
import { mentorParamsSchema } from '../requests/mentor-params.request.js';
import { weekQuerySchema } from '../requests/week-query.request.js';
import { AvailabilityService } from '../services/availability.service.js';
import type { AvailabilityBlockResponse } from '../types/availability-block-response.types.js';
import type { MentorParamsPayload } from '../types/mentor-params-payload.types.js';
import type { WeekQueryPayload } from '../types/week-query-payload.types.js';

@Controller('mentors')
export class MentorAvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get(':id/free-blocks')
  @UseGuards(ProvisionalSessionGuard, RolesGuard)
  @Roles('titulado')
  @ApiOperation({ summary: FIND_MENTOR_FREE_BLOCKS_DOCS.summary })
  @ApiParam({ name: 'id', description: FIND_MENTOR_FREE_BLOCKS_DOCS.idDescription })
  @ApiQuery({ name: 'from', description: FIND_MENTOR_FREE_BLOCKS_DOCS.fromDescription })
  @ApiQuery({ name: 'to', description: FIND_MENTOR_FREE_BLOCKS_DOCS.toDescription })
  findMentorFreeBlocks(
    @Param(new ZodValidationPipe(mentorParamsSchema)) params: MentorParamsPayload,
    @Query(new ZodValidationPipe(weekQuerySchema)) query: WeekQueryPayload,
  ): Promise<AvailabilityBlockResponse[]> {
    return this.availabilityService.findMentorFreeBlocks(params.id, query);
  }
}
