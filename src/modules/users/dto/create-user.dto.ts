import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsValidLocationConstraint } from '../validators/is-valid-location.constraint';
import { IsDateOnlyFormatConstraint } from '../validators/is-date-only-format.constraint';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(IsValidLocationConstraint)
  location: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDateString({ strict: true })
  @Validate(IsDateOnlyFormatConstraint)
  birthDate: string;
}
