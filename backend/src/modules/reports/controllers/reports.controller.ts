import { Controller, Get, Query, StreamableFile } from '@nestjs/common';
import { ApiProduces, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../../../common/decorators/response-message.decorator.js';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import {
  registeredUsersFiltersSchema,
  registeredUsersQuerySchema,
  rejectedUsersFiltersSchema,
  rejectedUsersQuerySchema,
  type RegisteredUsersFilters,
  type RegisteredUsersQuery,
  type RejectedUsersFilters,
  type RejectedUsersQuery,
} from '../requests/report-users.schema.js';
import { ReportsService } from '../services/reports.service.js';

@ApiTags('Reportes')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('registered-users')
  @ResponseMessage('Usuarios registrados obtenidos correctamente')
  getRegisteredUsers(
    @Query(new ZodValidationPipe(registeredUsersQuerySchema))
    query: RegisteredUsersQuery,
  ) {
    return this.reportsService.getRegisteredUsers(query);
  }

  @Get('registered-users/export')
  @ApiProduces('text/csv')
  exportRegisteredUsersCsv(
    @Query(new ZodValidationPipe(registeredUsersFiltersSchema))
    filters: RegisteredUsersFilters,
  ): StreamableFile {
    const { fileName, content } =
      this.reportsService.exportRegisteredUsersCsv(filters);

    return new StreamableFile(Buffer.from(content, 'utf-8'), {
      type: 'text/csv; charset=utf-8',
      disposition: `attachment; filename="${fileName}"`,
    });
  }

  @Get('rejected-users')
  @ResponseMessage('Usuarios rechazados obtenidos correctamente')
  getRejectedUsers(
    @Query(new ZodValidationPipe(rejectedUsersQuerySchema))
    query: RejectedUsersQuery,
  ) {
    return this.reportsService.getRejectedUsers(query);
  }

  @Get('rejected-users/export')
  @ApiProduces('text/csv')
  exportRejectedUsersCsv(
    @Query(new ZodValidationPipe(rejectedUsersFiltersSchema))
    filters: RejectedUsersFilters,
  ): StreamableFile {
    const { fileName, content } =
      this.reportsService.exportRejectedUsersCsv(filters);

    return new StreamableFile(Buffer.from(content, 'utf-8'), {
      type: 'text/csv; charset=utf-8',
      disposition: `attachment; filename="${fileName}"`,
    });
  }
}
