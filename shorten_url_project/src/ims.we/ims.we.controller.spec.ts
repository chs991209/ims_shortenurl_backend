import { Test, TestingModule } from '@nestjs/testing';
import { ImsWeController } from './ims.we.controller';
import { ImsWeService } from './ims.we.service';

describe('ImsWeController', () => {
  let controller: ImsWeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImsWeController],
      providers: [ImsWeService],
    }).compile();

    controller = module.get<ImsWeController>(ImsWeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
