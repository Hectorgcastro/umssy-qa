import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { OrientationTypeMapper, OrientationTypeResponseDto } from './dto/orientation-type-response.dto.js';

@Injectable()
export class OrientationTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<OrientationTypeResponseDto[]> {
    const orientationTypes = await this.prisma.orientationType.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return OrientationTypeMapper.toDtoList(orientationTypes);
  }
}