import { Module } from '@nestjs/common';
import { TaskSchedulerService } from './task-scheduler.service';
import { MessagesModule } from 'src/modules/messages/messages.module';

@Module({
  imports: [MessagesModule],
  providers: [TaskSchedulerService],
})
export class TaskSchedulerModule {}
