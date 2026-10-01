import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller.js';
import { ReportUsersRepository } from './repositories/report-users.repository.js';
import { ReportsService } from './services/reports.service.js';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, ReportUsersRepository],
})
export class ReportsModule {}
