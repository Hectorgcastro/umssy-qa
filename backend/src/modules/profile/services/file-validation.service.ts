import { Injectable } from '@nestjs/common';
import { FILE_SIGNATURES } from '../constants/file-signatures.constants.js';
import { CorruptedFileException } from '../exceptions/corrupted-file.exception.js';
import { EmptyFileException } from '../exceptions/empty-file.exception.js';
import { FileTooLargeException } from '../exceptions/file-too-large.exception.js';
import { InvalidFileTypeException } from '../exceptions/invalid-file-type.exception.js';
import type { FileSignature } from '../types/file-signature.type.js';
import type { FileValidationRules } from '../types/file-validation-rules.type.js';
import type { UploadedFile } from '../types/uploaded-file.type.js';
import type { ValidatedFile } from '../types/validated-file.type.js';

@Injectable()
export class FileValidationService {
  validate(
    file: UploadedFile | undefined,
    rules: FileValidationRules,
  ): ValidatedFile {
    if (!file || file.size === 0 || file.buffer.length === 0) {
      throw new EmptyFileException();
    }

    if (file.size > rules.maxSizeBytes || file.buffer.length > rules.maxSizeBytes) {
      throw new FileTooLargeException();
    }

    const signature = this.detectSignature(file.buffer);

    if (!signature || !rules.allowedTypes.includes(signature.type)) {
      throw new InvalidFileTypeException();
    }

    if (!this.hasEndMarker(file.buffer, signature)) {
      throw new CorruptedFileException();
    }

    return {
      ...file,
      detectedType: signature.type,
      detectedMimeType: signature.mimeType,
    };
  }

  detectMimeType(buffer: Buffer): string | undefined {
    return this.detectSignature(buffer)?.mimeType;
  }

  private detectSignature(buffer: Buffer): FileSignature | undefined {
    return FILE_SIGNATURES.find((signature) =>
      signature.bytes.every((byte, index) => buffer[index] === byte),
    );
  }

  private hasEndMarker(buffer: Buffer, signature: FileSignature): boolean {
    const searchStart = Math.max(
      signature.bytes.length,
      buffer.length - signature.endMarkerSearchBytes,
    );

    return buffer.subarray(searchStart).includes(Buffer.from(signature.endMarker));
  }
}
