import { BadRequestException, Body, Controller, Delete, Param, ParseUUIDPipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import { MAX_FILE_SIZE_BYTES } from '../../files/types/file-rules.js';
import { DocumentUploadInterceptor } from '../interceptors/document-upload.interceptor.js';
import { AccessRequestsService } from '../services/access-requests.service.js';
import { createAccessRequestSchema, type CreateAccessRequestDto } from '../requests/create-access-request.schema.js';
import { attachDocumentSchema, type AttachDocumentDto } from '../requests/attach-document.schema.js';
import type { UploadedDocumentFile } from '../types/uploaded-file.types.js';
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

  @Delete(':id')
  delete(@Param('id', uuidPipe) id: string) {
    return this.accessRequestsService.delete(id);
  }

  // DocumentUploadInterceptor va primero para envolver y traducir el error de Multer
  @Post(':id/document')
  @UseInterceptors(DocumentUploadInterceptor, FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE_BYTES } }))
  attachDocument(
    @Param('id', uuidPipe) id: string,
    @UploadedFile() file: UploadedDocumentFile | undefined,
    @Body(new ZodValidationPipe(attachDocumentSchema)) body: AttachDocumentDto,
  ) {
    return this.accessRequestsService.attachDocument(id, { file, documentType: body.documentType });
  }

  @Delete(':id/document')
  removeDocument(@Param('id', uuidPipe) id: string) {
    return this.accessRequestsService.removeDocument(id);
  }
}
