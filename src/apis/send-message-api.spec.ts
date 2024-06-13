import { Test, TestingModule } from '@nestjs/testing';
import { SendMessageApiService } from './send-message-api.service';

describe('SendMessageApiService', () => {
  let service: SendMessageApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendMessageApiService],
    }).compile();

    service = module.get<SendMessageApiService>(SendMessageApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
