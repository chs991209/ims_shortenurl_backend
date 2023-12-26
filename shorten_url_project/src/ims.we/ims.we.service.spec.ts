import { Test, TestingModule } from '@nestjs/testing';
import { ImsWeService } from './ims.we.service';

describe('ImsWeService', () => {
  let service: ImsWeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImsWeService],
    }).compile();

    service = module.get<ImsWeService>(ImsWeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
