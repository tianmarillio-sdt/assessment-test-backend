import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MessagesService } from 'src/modules/messages/messages.service';

@Injectable()
export class TaskSchedulerService {
  constructor(private messagesService: MessagesService) {}

  /**
   * Runs every 15 minutes,
   * to also handle non-standard GMT offsets such as:
   * GMT+09:30 - Australian Central Standard Time (ACST)
   * GMT+05:45 - Nepal Time (NPT)
   */
  @Cron('*/15 * * * *')
  async sendBirthdayMessages() {
    console.log('JOB START: Sending birthday messages.');

    await this.messagesService.sendBirthdayMessages();

    console.log('JOB END: Sending birthday messages.');
  }
}
