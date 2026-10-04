import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import type { UserSkillRecord } from '../types/user-skill-record.type.js';
import { skillSelect } from './skill.repository.js';

const userSkillSelect = { skill: { select: skillSelect } } as const;

@Injectable()
export class UserSkillRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<UserSkillRecord[]> {
    return this.prisma.userSkill.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: userSkillSelect,
    });
  }
}
