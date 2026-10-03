import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import type { ProfileRecord } from '../types/profile-record.type.js';

// Only the profile columns of users; password and file columns are never read here.
const profileSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  personalEmail: true,
  phone: true,
  headline: true,
  aboutMe: true,
  updatedAt: true,
  city: { select: { id: true, title: true } },
} as const;

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<ProfileRecord | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: profileSelect,
    });
  }
}
