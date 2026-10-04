import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AvailabilityService } from '../services/availability.service.js';
import { createBlockSchema } from '../requests/create-block.request.js';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import { ProvisionalSessionGuard } from '../../../common/guards/provisional.guard.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { Roles, type AuthenticatedUser } from '../../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';

@Controller('availability-blocks')
@UseGuards(ProvisionalSessionGuard, RolesGuard)
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  @Roles('mentor')
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(createBlockSchema))
    body: ReturnType<typeof createBlockSchema.parse>,
  ) {
    return this.availabilityService.create(user.id, body);
  }
}
