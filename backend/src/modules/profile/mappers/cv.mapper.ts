import { Injectable } from '@nestjs/common';
import type { CvResponse } from '../responses/cv.response.js';
import type { CvFileDownload } from '../types/cv-file-download.type.js';
import type { CvMetadataRecord } from '../types/cv-metadata-record.type.js';
import type { MulterFile } from '../types/multer-file.type.js';
import type { UploadedFile } from '../types/uploaded-file.type.js';

const cvMimeType = 'application/pdf';

const cvFileNamePrefix = 'CV';

const cvFileExtension = '.pdf';

@Injectable()
export class CvMapper {
  toUploadedFile(file: MulterFile): UploadedFile {
    return {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      buffer: file.buffer,
    };
  }

  toResponse(record: CvMetadataRecord): CvResponse | null {
    if (record.sizeBytes === null) {
      return null;
    }

    return {
      fileName: this.buildFileName(record),
      fileType: cvMimeType,
      sizeInBytes: record.sizeBytes,
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  toFileDownload(content: Buffer, record: CvMetadataRecord): CvFileDownload {
    return {
      content,
      fileName: this.buildFileName(record),
      mimeType: cvMimeType,
    };
  }

  private buildFileName(record: CvMetadataRecord): string {
    const nameParts = [record.firstName, record.lastName]
      .map((part) => this.toAsciiSlug(part))
      .filter((part) => part.length > 0);

    return [cvFileNamePrefix, ...nameParts].join('-') + cvFileExtension;
  }

  private toAsciiSlug(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^A-Za-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
