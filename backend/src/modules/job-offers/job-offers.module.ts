import { Module } from '@nestjs/common';
import { JobOffersController } from './job-offers.controller';
import { JobOffersService } from './job-offers.service';

@Module({
  controllers: [JobOffersController],
  providers: [
    JobOffersService,
    {
      provide: 'PRISMA_SERVICE',
      useFactory: () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { PrismaService } = require('../../prisma/prisma.service');
        return new PrismaService();
      },
    },
  ],
  exports: [JobOffersService],
})
export class JobOffersModule {}