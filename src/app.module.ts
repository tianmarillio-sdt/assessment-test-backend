import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { TaskSchedulerModule } from './task-scheduler/task-scheduler.module';
import { UtilsModule } from './utils/utils.module';

import { UsersModule } from './modules/users/users.module';
import { LocationsModule } from './modules/locations/locations.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ApisModule } from './apis/apis.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),

    DatabaseModule,
    TaskSchedulerModule,
    UtilsModule,

    UsersModule,
    LocationsModule,
    MessagesModule,
    ApisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
