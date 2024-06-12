import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskSchedulerService {
  private readonly logger = new Logger(TaskSchedulerService.name);

  @Cron('1 * * * * *')
  handleCron() {
    console.log('Logging 1 sec');
    this.logger.debug('Called when the current second is 45');
  }
}
