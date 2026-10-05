import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { Prisma } from '../../../prisma/client.js';
import { AccessRequestNotFoundException } from '../exceptions/index.js';
import type { CreateAccessRequestDto } from '../requests/create-access-request.schema.js';
import type { UpdateAccessRequestDto } from '../requests/update-access-request.schema.js';
import { ACCESS_REQUEST_STATUS } from '../types/access-request.enum.js';

// Nunca se selecciona el archivo adjunto: solo la referencia documentFileId
const ACCESS_REQUEST_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  idCardNumber: true,
  idCardIssuedIn: true,
  sisCode: true,
  email: true,
  phone: true,
  birthDate: true,
  entryYear: true,
  documentFileId: true,
  createdAt: true,
  updatedAt: true,
  status: { select: { title: true } },
} satisfies Prisma.AccessRequestSelect;

@Injectable()
export class AccessRequestsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createDraft(data: CreateAccessRequestDto) {
    return this.prisma.accessRequest.create({
      data: { ...data, status: { connect: { title: ACCESS_REQUEST_STATUS.DRAFT } } },
      select: ACCESS_REQUEST_SELECT,
    });
  }

  findById(id: string) {
    return this.prisma.accessRequest.findUnique({ where: { id }, select: ACCESS_REQUEST_SELECT });
  }

  async updateDraft(id: string, data: UpdateAccessRequestDto) {
    try {
      return await this.prisma.accessRequest.update({
        where: { id, status: { title: ACCESS_REQUEST_STATUS.DRAFT } },
        data,
        select: ACCESS_REQUEST_SELECT,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new AccessRequestNotFoundException();
      }
      throw error;
    }
  }
}
