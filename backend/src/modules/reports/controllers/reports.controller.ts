import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../../../common/decorators/response-message.decorator.js';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import {
  registeredUsersQuerySchema,
  rejectedUsersQuerySchema,
  type RegisteredUsersQuery,
  type RejectedUsersQuery,
} from '../requests/report-users.schema.js';
import {
  reportHistoryQuerySchema,
  type ReportHistoryQuery,
} from '../requests/report-history.schema.js';
import { ReportHistoryService } from '../services/report-history.service.js';
import { ReportsService } from '../services/reports.service.js';

@ApiTags('Reportes')
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly reportHistoryService: ReportHistoryService,
  ) {}

  @Get('registered-users')
  @ResponseMessage('Usuarios registrados obtenidos correctamente')
  getRegisteredUsers(
    @Query(new ZodValidationPipe(registeredUsersQuerySchema))
    query: RegisteredUsersQuery,
  ) {
    return this.reportsService.getRegisteredUsers(query);
  }

  @Get('rejected-users')
  @ResponseMessage('Usuarios rechazados obtenidos correctamente')
  getRejectedUsers(
    @Query(new ZodValidationPipe(rejectedUsersQuerySchema))
    query: RejectedUsersQuery,
  ) {
    return this.reportsService.getRejectedUsers(query);
  }

  @Get('history')
  @ResponseMessage('Historial de reportes obtenido correctamente')
  getReportHistory(
    @Query(new ZodValidationPipe(reportHistoryQuerySchema))
    query: ReportHistoryQuery,
  ) {
    return this.reportHistoryService.getReportHistory(query);
  }
}
