import { Injectable } from '@nestjs/common';
import { FilesRepository } from '../repositories/files.repository.js';
import { EmptyFileException, FileNotFoundException, FileTooLargeException, InvalidFileTypeException } from '../exceptions/index.js';
import {
  DEFAULT_FILE_NAME,
  FILE_TYPES,
  MAX_FILE_NAME_LENGTH,
  MAX_FILE_SIZE_BYTES,
  type FileTypeRule,
} from '../types/file-rules.js';
import type { CreateFileInput, FileContent, FileMetadata } from '../types/file.types.js';

const KNOWN_EXTENSION_REGEX = /\.(pdf|png|jpe?g)$/i;
const FORBIDDEN_CHARS_REGEX = /[\\/:*?"<>|]/g;
const EDGE_DOTS_AND_SPACES_REGEX = /^[.\s]+|[.\s]+$/g;

const LAST_CONTROL_CODE = 0x1f;
const DELETE_CODE = 0x7f;

function removeControlChars(value: string): string {
  return Array.from(value)
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code > LAST_CONTROL_CODE && code !== DELETE_CODE;
    })
    .join('');
}

@Injectable()
export class FilesService {
  constructor(private readonly filesRepository: FilesRepository) {}

  async create(input: CreateFileInput): Promise<FileMetadata> {
    const { content } = input;
    if (content.length === 0) {
      throw new EmptyFileException();
    }
    if (content.length > MAX_FILE_SIZE_BYTES) {
      throw new FileTooLargeException();
    }

    const type = this.detectType(content);
    if (!type) {
      throw new InvalidFileTypeException();
    }

    return this.filesRepository.create({
      name: this.sanitizeName(input.name),
      extension: type.extension,
      mimeType: type.mimeType,
      size: content.length,
      content,
    });
  }

  async getMetadata(id: string): Promise<FileMetadata> {
    const file = await this.filesRepository.findMetadataById(id);
    if (!file) {
      throw new FileNotFoundException();
    }
    return file;
  }

  async getContent(id: string): Promise<FileContent> {
    const file = await this.filesRepository.findContentById(id);
    if (!file) {
      throw new FileNotFoundException();
    }
    return { ...file, content: Buffer.from(file.content) };
  }

  delete(id: string): Promise<void> {
    return this.filesRepository.delete(id);
  }

  private detectType(content: Buffer): FileTypeRule | undefined {
    return FILE_TYPES.find((type) => type.signature.every((byte, index) => content[index] === byte));
  }

  // Quita rutas, caracteres de control o prohibidos y la extensión conocida; la extensión guardada sale del tipo detectado
  private sanitizeName(rawName: string | undefined): string {
    const baseName = (rawName ?? '').split(/[\\/]/).pop() ?? '';
    const name = removeControlChars(baseName)
      .replace(KNOWN_EXTENSION_REGEX, '')
      .replace(FORBIDDEN_CHARS_REGEX, '')
      .replace(EDGE_DOTS_AND_SPACES_REGEX, '')
      .slice(0, MAX_FILE_NAME_LENGTH)
      .replace(EDGE_DOTS_AND_SPACES_REGEX, '');

    return name.length > 0 ? name : DEFAULT_FILE_NAME;
  }
}
