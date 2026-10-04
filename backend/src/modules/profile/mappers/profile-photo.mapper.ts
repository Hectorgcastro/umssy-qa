import { Injectable } from '@nestjs/common';
import type { ProfilePhotoResponse } from '../responses/profile-photo.response.js';
import type { MulterFile } from '../types/multer-file.type.js';
import type { UploadedFile } from '../types/uploaded-file.type.js';
import type { ValidatedFile } from '../types/validated-file.type.js';

@Injectable()
export class ProfilePhotoMapper {
  toUploadedFile(file: MulterFile): UploadedFile {
    return {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      buffer: file.buffer,
    };
  }

  toResponse(file: ValidatedFile): ProfilePhotoResponse {
    return {
      mimeType: file.detectedMimeType,
      sizeInBytes: file.buffer.length,
    };
  }
}
