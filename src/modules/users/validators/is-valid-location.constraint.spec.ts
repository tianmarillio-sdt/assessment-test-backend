import { Test, TestingModule } from '@nestjs/testing';
import { IsValidLocationConstraint } from './is-valid-location.constraint';

describe('IsValidLocationConstraint', () => {
  let provider: IsValidLocationConstraint;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IsValidLocationConstraint],
    }).compile();

    provider = module.get<IsValidLocationConstraint>(IsValidLocationConstraint);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
