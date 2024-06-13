import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './repositories/users.repository';
import { IsValidLocationConstraint } from './validators/is-valid-location.constraint';
import { IsDateOnlyFormatConstraint } from './validators/is-date-only-format.constraint';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    IsValidLocationConstraint,
    IsDateOnlyFormatConstraint,
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
