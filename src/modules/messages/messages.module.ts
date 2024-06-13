import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesRepository } from './repositories/messages.repository';
import { UsersModule } from '../users/users.module';
import { ApisModule } from 'src/apis/apis.module';

@Module({
  imports: [UsersModule, ApisModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
  exports: [MessagesService],
})
export class MessagesModule {}
