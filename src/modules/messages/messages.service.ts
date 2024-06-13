import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/repositories/users.repository';
import { MessagesRepository } from './repositories/messages.repository';
import { MessageType } from './interfaces/message-type.enum';
import { DateService } from 'src/utils/date/date.service';
import { SendMessageApiService } from 'src/apis/send-message-api.service';

@Injectable()
export class MessagesService {
  private TEST_EMAIL: string;

  constructor(
    private messagesRepository: MessagesRepository,
    private usersRepository: UsersRepository,
    private dateService: DateService,
    private sendMessageApi: SendMessageApiService,
  ) {
    this.TEST_EMAIL = 'test@digitalenvision.com.au';
  }

  async sendBirthdayMessages() {
    const currentDate = this.dateService.getCurrentUTCDate();
    const sendScheduleAt = this.dateService.getMinuteStart(currentDate);
    const parsedSendScheduleAt =
      this.dateService.parseDateStringUTC(sendScheduleAt);

    const users = await this.usersRepository.findBirthdayUsers({
      month: parsedSendScheduleAt.month,
      day: parsedSendScheduleAt.day,
      hour: parsedSendScheduleAt.hour,
      minute: parsedSendScheduleAt.minute,
    });

    // TODO: use promise.all, by 50 or 100 users
    for (const user of users) {
      const birthdayMessage = this.getBirthdayMessage(
        user.firstName,
        user.lastName,
      );

      await this.sendMessage(
        user.id,
        sendScheduleAt,
        MessageType.BIRTHDAY,
        birthdayMessage,
      );
    }
  }

  async resendUnsentBirthdayMessages() {
    const messages = await this.messagesRepository.findAllUnsentMessages();

    // TODO: limit API calls per Queue
    for (const message of messages) {
      const user = await this.usersRepository.findById(message.userId);
      const birthdayMessage = this.getBirthdayMessage(
        user.firstName,
        user.lastName,
      );

      await this.postSendMessageApi(message.id, birthdayMessage);
    }

    return {
      status: 'success',
    };
  }

  private async sendMessage(
    userId: string,
    sendScheduleAt: string,
    type: MessageType,
    message: string,
  ) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const created = await this.messagesRepository.create({
      sendScheduleAt,
      type,
      user: {
        connect: {
          id: userId,
        },
      },
    });

    await this.postSendMessageApi(created.id, message);
  }

  private getBirthdayMessage(firstName: string, lastName: string) {
    const fullname = `${firstName} ${lastName}`.trim();

    return `Hey, ${fullname} it's your birthday`;
  }

  private async postSendMessageApi(messageId: string, message: string) {
    try {
      const response = await this.sendMessageApi.post<{
        status: string;
        sentTime: string;
      }>('/send-email', {
        email: this.TEST_EMAIL,
        message,
      });

      if (response?.status === HttpStatus.OK) {
        await this.messagesRepository.update(messageId, {
          isSent: true,
          sentAt: this.dateService.getCurrentUTCDate(),
        });
      }

      return true;
    } catch (error) {
      /**
       * should log the error
       * should return instead of throwing an error to prevent CronJob failed midway
       */
      console.log(`Error sending message with id: ${messageId}`);

      return false;
    }
  }
}
