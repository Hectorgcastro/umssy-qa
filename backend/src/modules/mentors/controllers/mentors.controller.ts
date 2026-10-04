import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user.types.js';
import {
  activateMentorSchema,
  type ActivateMentorDto,
} from '../requests/activate-mentor.schema.js';
import { MentorsService } from '../services/mentors.service.js';

@Controller('mentors')
export class MentorsController {
  constructor(
    private readonly mentorsService: MentorsService,
  ) {}

  @Post('activate')
  @UseGuards(JwtAuthGuard)
  activate(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(activateMentorSchema)) body: ActivateMentorDto,
  ) {
    return this.mentorsService.activate(user.id, body);
  }
}
