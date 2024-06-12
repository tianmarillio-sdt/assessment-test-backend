import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DateService } from 'src/utils/date/date.service';

@Injectable()
@ValidatorConstraint()
export class IsValidLocationConstraint implements ValidatorConstraintInterface {
  constructor(private dateService: DateService) {}

  validate(value: string) {
    return this.dateService.validateZone(value);
  }

  defaultMessage() {
    return 'Invalid location, must be in IANA string format (e.g. America/New_York). For list of valid locations, please checkout GET /locations or visit https://en.wikipedia.org/wiki/List_of_tz_database_time_zones';
  }
}
