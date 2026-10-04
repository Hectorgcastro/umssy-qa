import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';

@Injectable()
export class OrientationTypesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveOrientationTypes() {
    return this.prisma.orientationType.findMany({
      where: { isActive: true }, // Se respeta el estado activo según el modelo
      orderBy: { name: 'asc' },
    });
  }
}