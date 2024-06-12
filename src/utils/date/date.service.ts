import { Injectable } from '@nestjs/common';
import { DateTime, IANAZone } from 'luxon';
import { timeZonesNames } from '@vvo/tzdb';

@Injectable()
export class DateService {
  getCurrentDate() {
    return DateTime.now().toISO();
  }

  parseDateStringByTimeZone(dateString: string, zone: string) {
    const dateTime = DateTime.fromISO(dateString, { zone });

    return dateTime.toISO();
    // return dateTime.setZone(zone).toISO();
  }

  addHours(dateString: string, hours: number) {
    const addedDateTime = DateTime.fromISO(dateString).plus({ hours });

    return addedDateTime.toISO();
  }

  getValidZones() {
    return timeZonesNames;
  }

  validateZone(zone: string) {
    return IANAZone.isValidZone(zone);
  }
}
