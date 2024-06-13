import { Test, TestingModule } from '@nestjs/testing';
import { IsDateOnlyFormatConstraint } from './is-date-only-format.constraint';

describe('IsDateOnlyFormatConstraint', () => {
  let provider: IsDateOnlyFormatConstraint;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IsDateOnlyFormatConstraint],
    }).compile();

    provider = module.get<IsDateOnlyFormatConstraint>(
      IsDateOnlyFormatConstraint,
    );
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
