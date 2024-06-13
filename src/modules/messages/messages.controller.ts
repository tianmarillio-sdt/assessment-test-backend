import { Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('resend-birthday-messages')
  async sendUnsentBirthdayMessages() {
    return await this.messagesService.resendUnsentBirthdayMessages();
  }
}
