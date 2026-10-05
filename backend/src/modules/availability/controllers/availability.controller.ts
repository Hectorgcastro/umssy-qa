import { Controller, Delete, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import { Roles } from '../../../common/decorators/roles.decorator.js';
import type { AuthenticatedUser } from '../../../common/decorators/roles.decorator.js';
import { ProvisionalSessionGuard } from '../../../common/guards/provisional.guard.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import { DELETE_BLOCK_DOCS, FIND_MY_BLOCKS_DOCS } from '../constants/availability-docs.constants.js';
import { weekQuerySchema } from '../requests/week-query.request.js';
import { blockIdSchema } from '../requests/block-id.request.js';
import { AvailabilityService } from '../services/availability.service.js';
import type { AvailabilityBlockResponse } from '../types/availability-block-response.types.js';
import type { WeekQueryPayload } from '../types/week-query-payload.types.js';
import type { DeletedBlockResponse } from '../types/deleted-block-response.types.js';

@Controller('availability-blocks')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  @UseGuards(ProvisionalSessionGuard, RolesGuard)
  @Roles('mentor')
  @ApiOperation({ summary: FIND_MY_BLOCKS_DOCS.summary })
  @ApiQuery({ name: 'from', description: FIND_MY_BLOCKS_DOCS.fromDescription })
  @ApiQuery({ name: 'to', description: FIND_MY_BLOCKS_DOCS.toDescription })
  findMyBlocks(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(weekQuerySchema)) query: WeekQueryPayload,
  ): Promise<AvailabilityBlockResponse[]> {
    return this.availabilityService.findMyBlocks(user.id, query);
  }

  @Delete(':id')
  @UseGuards(ProvisionalSessionGuard, RolesGuard)
  @Roles('mentor')
  @ApiOperation({ summary: DELETE_BLOCK_DOCS.summary, description: DELETE_BLOCK_DOCS.description })
  @ApiParam({ name: 'id', description: DELETE_BLOCK_DOCS.idDescription })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ZodValidationPipe(blockIdSchema)) id: string,
  ): Promise<DeletedBlockResponse> {
    return this.availabilityService.remove(user.id, id);
  }
}
