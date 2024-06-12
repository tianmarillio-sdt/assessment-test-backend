import { Injectable } from '@nestjs/common';
import { DateService } from 'src/utils/date/date.service';

@Injectable()
export class LocationsService {
  constructor(private dateService: DateService) {}

  getLocations() {
    const locations = this.dateService.getValidZones();

    return locations;
  }
}
