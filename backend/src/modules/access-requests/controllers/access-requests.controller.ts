import { BadRequestException, Body, Controller, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import { AccessRequestsService } from '../services/access-requests.service.js';
import { createAccessRequestSchema, type CreateAccessRequestDto } from '../requests/create-access-request.schema.js';
import { updateAccessRequestSchema, type UpdateAccessRequestDto } from '../requests/update-access-request.schema.js';

const uuidPipe = new ParseUUIDPipe({
  exceptionFactory: () => new BadRequestException('El identificador de la solicitud no es válido'),
});

@Controller('access-requests')
export class AccessRequestsController {
  constructor(private readonly accessRequestsService: AccessRequestsService) {}

  @Post()
  create(@Body(new ZodValidationPipe(createAccessRequestSchema)) body: CreateAccessRequestDto) {
    return this.accessRequestsService.create(body);
  }

  @Patch(':id')
  update(@Param('id', uuidPipe) id: string, @Body(new ZodValidationPipe(updateAccessRequestSchema)) body: UpdateAccessRequestDto) {
    return this.accessRequestsService.update(id, body);
  }
}
