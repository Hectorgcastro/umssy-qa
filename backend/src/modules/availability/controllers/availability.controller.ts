import { Body, Controller, Delete, Get, Param,ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import { Roles } from '../../../common/decorators/roles.decorator.js';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user.types.js';
import { ProvisionalSessionGuard } from '../../../common/guards/provisional.guard.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import {
  CREATE_BLOCK_DOCS,
  DELETE_BLOCK_DOCS,
  FIND_MY_BLOCKS_DOCS,
  UPDATE_BLOCK_DOCS
} from '../constants/availability-docs.constants.js';
import { createBlockSchema } from '../requests/create-block.request.js';
import { weekQuerySchema } from '../requests/week-query.request.js';
import { blockIdSchema } from '../requests/block-id.request.js';
import { AvailabilityService } from '../services/availability.service.js';
import type { AvailabilityBlockResponse } from '../types/availability-block-response.types.js';
import type { CreateBlockPayload } from '../types/create-block-payload.types.js';
import type { WeekQueryPayload } from '../types/week-query-payload.types.js';
import type { DeletedBlockResponse } from '../types/deleted-block-response.types.js';
import { updateBlockSchema } from '../requests/update-block.request.js';
import type { UpdateBlockPayload } from '../requests/update-block.request.js';

@Controller('availability-blocks')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  @UseGuards(ProvisionalSessionGuard, RolesGuard)
  @Roles('mentor')
  @ApiOperation({ summary: CREATE_BLOCK_DOCS.summary })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(createBlockSchema)) body: CreateBlockPayload,
  ): Promise<AvailabilityBlockResponse> {
    return this.availabilityService.create(user.id, body);
  }

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

  @Patch(':id')
  @UseGuards(ProvisionalSessionGuard, RolesGuard)
  @Roles('mentor')
  @ApiOperation({ summary: UPDATE_BLOCK_DOCS.summary })
  @ApiParam({ name: 'id', description: UPDATE_BLOCK_DOCS.idDescription })
  updateBlock(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateBlockSchema)) body: UpdateBlockPayload,
  ): Promise<AvailabilityBlockResponse> {
    return this.availabilityService.updateBlock(user.id, id, body);
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
