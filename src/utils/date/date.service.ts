import { Injectable } from '@nestjs/common';
import { DateTime, IANAZone } from 'luxon';
import { timeZonesNames } from '@vvo/tzdb';

@Injectable()
export class DateService {
  getCurrentUTCDate() {
    return DateTime.now().toUTC().toISO();
  }

  /**
   * Will mutate the date based on time zone
   */
  parseDateOnlyStringByTimeZone(dateOnlyString: string, zone: string) {
    const dateTime = DateTime.fromISO(dateOnlyString, { zone });

    return dateTime.toUTC().toISO();
  }

  addHours(dateString: string, hours: number) {
    const addedDateTime = DateTime.fromISO(dateString).plus({ hours });

    return addedDateTime.toUTC().toISO();
  }

  getMinuteStart(dateString: string) {
    const dateTime = DateTime.fromISO(dateString).startOf('minute');

    return dateTime.toUTC().toISO();
  }

  parseDateStringUTC(dateString: string) {
    const dateTime = DateTime.fromISO(dateString).toUTC();

    return {
      year: dateTime.year,
      month: dateTime.month,
      day: dateTime.day,
      hour: dateTime.hour,
      minute: dateTime.minute,
      second: dateTime.second,
      zone: dateTime.zone,
    };
  }

  getValidZones() {
    return timeZonesNames;
  }

  validateZone(zone: string) {
    return IANAZone.isValidZone(zone);
  }
}
