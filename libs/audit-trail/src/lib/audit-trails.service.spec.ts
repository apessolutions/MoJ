import { Test, TestingModule } from '@nestjs/testing';
import { AuditTrailsService } from './audit-trails.service';

describe('AuditTrailsService', () => {
  let service: AuditTrailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditTrailsService],
    }).compile();

    service = module.get<AuditTrailsService>(AuditTrailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
