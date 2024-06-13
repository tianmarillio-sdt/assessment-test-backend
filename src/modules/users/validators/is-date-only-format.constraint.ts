import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint()
export class IsDateOnlyFormatConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string) {
    // Pattern for format: yyyy-MM-dd
    const dateFormatPattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    return dateFormatPattern.test(value);
  }

  defaultMessage() {
    return 'Invalid date string, must satisfy format: yyyy-MM-dd';
  }
}
