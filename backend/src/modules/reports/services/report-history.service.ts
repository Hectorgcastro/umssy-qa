import { Injectable } from '@nestjs/common';
import type { PaginatedResult } from '../../../common/types/api-response.types.js';
import { paginate } from '../../../common/utils/pagination.js';
import { GeneratedReportsRepository } from '../repositories/generated-reports.repository.js';
import type { ReportHistoryQuery } from '../requests/report-history.schema.js';
import type { GeneratedReport } from '../types/generated-report.types.js';

function sortByNewest(reports: readonly GeneratedReport[]): GeneratedReport[] {
  return [...reports].sort(
    (first, second) =>
      new Date(second.generatedAt).getTime() -
      new Date(first.generatedAt).getTime(),
  );
}

@Injectable()
export class ReportHistoryService {
  constructor(
    private readonly generatedReportsRepository: GeneratedReportsRepository,
  ) {}

  // Historial de reportes generados, del más reciente al más antiguo.
  getReportHistory(
    query: ReportHistoryQuery,
  ): PaginatedResult<GeneratedReport> {
    const reports = sortByNewest(this.generatedReportsRepository.findAll());

    return paginate(reports, query.page, query.limit);
  }
}
