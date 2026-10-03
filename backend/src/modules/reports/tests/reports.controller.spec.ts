import { Test, type TestingModule } from '@nestjs/testing';
import { ReportsController } from '../controllers/reports.controller.js';
import { GeneratedReportsRepository } from '../repositories/generated-reports.repository.js';
import { ReportUsersRepository } from '../repositories/report-users.repository.js';
import { ReportHistoryService } from '../services/report-history.service.js';
import { ReportsService } from '../services/reports.service.js';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;
  let historyService: ReportHistoryService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        ReportsService,
        ReportUsersRepository,
        ReportHistoryService,
        GeneratedReportsRepository,
      ],
    }).compile();

    controller = moduleRef.get(ReportsController);
    service = moduleRef.get(ReportsService);
    historyService = moduleRef.get(ReportHistoryService);
  });

  it('delega el reporte de registrados al service', () => {
    const query = { page: 1, limit: 10 };
    const spy = vi.spyOn(service, 'getRegisteredUsers');

    const result = controller.getRegisteredUsers(query);

    expect(spy).toHaveBeenCalledWith(query);
    expect(result.page).toBe(1);
  });

  it('delega el reporte de rechazados al service', () => {
    const query = { page: 1, limit: 10 };
    const spy = vi.spyOn(service, 'getRejectedUsers');

    const result = controller.getRejectedUsers(query);

    expect(spy).toHaveBeenCalledWith(query);
    expect(result.items.length).toBeGreaterThan(0);
  });

  it('delega el historial de reportes al service', () => {
    const query = { page: 1, limit: 10 };
    const spy = vi.spyOn(historyService, 'getReportHistory');

    const result = controller.getReportHistory(query);

    expect(spy).toHaveBeenCalledWith(query);
    expect(result.items.length).toBeGreaterThan(0);
  });
});
