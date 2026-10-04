export class OrientationTypeResponseDto {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export class OrientationTypeMapper {
  static toDto(entity: { id: string; name: string; description: string | null; isActive: boolean }): OrientationTypeResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? undefined,
      isActive: entity.isActive,
    };
  }

  static toDtoList(entities: Array<{ id: string; name: string; description: string | null; isActive: boolean }>): OrientationTypeResponseDto[] {
    return entities.map((entity) => OrientationTypeMapper.toDto(entity));
  }
}