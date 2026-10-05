import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { Prisma } from '../../../prisma/client.js';
import { AccessRequestCatalogMissingException, AccessRequestNotFoundException } from '../exceptions/index.js';
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
  graduationYear: true,
  documentFileId: true,
  createdAt: true,
  updatedAt: true,
  status: { select: { title: true } },
  career: { select: { title: true } },
} satisfies Prisma.AccessRequestSelect;

const ACTIVE_STATUSES: string[] = [
  ACCESS_REQUEST_STATUS.PENDING,
  ACCESS_REQUEST_STATUS.IN_REVIEW,
  ACCESS_REQUEST_STATUS.APPROVED,
];

@Injectable()
export class AccessRequestsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // En el create, P2025 solo puede venir de un connect: la carrera o el estado no existen (seed sin correr)
  async createDraft(data: CreateAccessRequestDto) {
    const { career, ...rest } = data;
    try {
      return await this.prisma.accessRequest.create({
        data: {
          ...rest,
          status: { connect: { title: ACCESS_REQUEST_STATUS.DRAFT } },
          career: { connect: { title: career } },
        },
        select: ACCESS_REQUEST_SELECT,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new AccessRequestCatalogMissingException();
      }
      throw error;
    }
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
    const { career, ...rest } = data;
    try {
      return await this.prisma.accessRequest.update({
        where: { id, status: { title: ACCESS_REQUEST_STATUS.DRAFT } },
        data: { ...rest, ...(career !== undefined && { career: { connect: { title: career } } }) },
        select: ACCESS_REQUEST_SELECT,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        // P2025 puede venir de la solicitud (no existe o ya no es borrador) o de un connect anidado (carrera o estado sin sembrar).
        // En el segundo caso el runtime de Prisma agrega meta.model con el modelo relacionado que falló; en el primero no.
        // Es un detalle interno del runtime, no una API documentada.
        // TODO: confirmar el comportamiento de meta al actualizar Prisma
        if (typeof error.meta?.model === 'string') {
          throw new AccessRequestCatalogMissingException();
        }
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
