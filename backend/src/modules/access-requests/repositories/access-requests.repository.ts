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

const ACTIVE_STATUSES: string[] = [
  ACCESS_REQUEST_STATUS.PENDING,
  ACCESS_REQUEST_STATUS.IN_REVIEW,
  ACCESS_REQUEST_STATUS.APPROVED,
];

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

  // Borradores y rechazadas no cuentan; excludeId evita chocar con la propia solicitud
  findActiveDuplicates(fields: { email?: string; idCardNumber?: string; sisCode?: string; excludeId?: string }) {
    const { email, idCardNumber, sisCode, excludeId } = fields;
    const matches: Prisma.AccessRequestWhereInput[] = [];
    if (email !== undefined) matches.push({ email: { equals: email, mode: 'insensitive' } });
    if (idCardNumber !== undefined) matches.push({ idCardNumber });
    if (sisCode !== undefined) matches.push({ sisCode });

    return this.prisma.accessRequest.findMany({
      where: {
        OR: matches,
        status: { title: { in: ACTIVE_STATUSES } },
        ...(excludeId !== undefined && { id: { not: excludeId } }),
      },
      select: { email: true, idCardNumber: true, sisCode: true },
    });
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

  // El filtro por estado hace que la eliminación sea atómica: si la solicitud cambió de estado o desapareció, lanza P2025
  async deleteDraft(id: string) {
    try {
      await this.prisma.accessRequest.delete({ where: { id, status: { title: ACCESS_REQUEST_STATUS.DRAFT } } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new AccessRequestNotFoundException();
      }
      throw error;
    }
  }
}
