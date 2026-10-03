import {
  Controller,
  Delete,
  Get,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUserId } from '../../../common/decorators/current-user-id.decorator.js';
import { ResponseInterceptor } from '../../../common/interceptors/response.interceptor.js';
import type { CvResponse } from '../responses/cv.response.js';
import { CvService } from '../services/cv.service.js';
import type { MulterFile } from '../types/multer-file.type.js';

const uploadFieldName = 'file';

const uploadSizeLimitBytes = 10 * 1024 * 1024;

@ApiTags('profile')
@ApiBearerAuth()
@UseInterceptors(ResponseInterceptor)
@Controller('profile/me/cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Get()
  getMetadata(@CurrentUserId() userId: string): Promise<CvResponse | null> {
    return this.cvService.getMetadata(userId);
  }

  @Put()
  @UseInterceptors(
    FileInterceptor(uploadFieldName, {
      limits: { fileSize: uploadSizeLimitBytes, files: 1 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: [uploadFieldName],
      properties: {
        [uploadFieldName]: { type: 'string', format: 'binary' },
      },
    },
  })
  upload(
    @CurrentUserId() userId: string,
    @UploadedFile() file: MulterFile | undefined,
  ): Promise<CvResponse | null> {
    return this.cvService.upload(userId, file);
  }

  @Delete()
  async remove(@CurrentUserId() userId: string): Promise<null> {
    await this.cvService.remove(userId);
    return null;
  }
}
