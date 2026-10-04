import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';

const userIdSelect = { id: true } as const;

// The photo bytes are stored in users.photo_url (a Bytes column).
@Injectable()
export class PhotoFileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(userId: string, content: Buffer): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { photoUrl: new Uint8Array(content) },
      select: userIdSelect,
    });
  }

  async read(userId: string): Promise<Buffer | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { photoUrl: true },
    });

    return user?.photoUrl ? Buffer.from(user.photoUrl) : null;
  }

  // Checks for a photo without loading its bytes.
  async exists(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, photoUrl: { not: null } },
      select: userIdSelect,
    });

    return user !== null;
  }

  async remove(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { photoUrl: null },
      select: userIdSelect,
    });
  }
}
