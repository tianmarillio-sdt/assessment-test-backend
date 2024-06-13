import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/repositories/users.repository';
import { MessagesRepository } from './repositories/messages.repository';
import { MessageType } from './interfaces/message-type.enum';
import { DateService } from 'src/utils/date/date.service';
import { SendMessageApiService } from 'src/apis/send-message-api.service';

@Injectable()
export class MessagesService {
  private TEST_EMAIL: string;
  private API_CALLS_PER_QUEUE: number;

  constructor(
    private messagesRepository: MessagesRepository,
    private usersRepository: UsersRepository,
    private dateService: DateService,
    private sendMessageApi: SendMessageApiService,
  ) {
    this.TEST_EMAIL = 'test@digitalenvision.com.au';
    this.API_CALLS_PER_QUEUE = 50;
  }

  async sendBirthdayMessages() {
    const currentDate = this.dateService.getCurrentUTCDate();
    const sendScheduleAt = this.dateService.getMinuteStart(currentDate);

    const users = await this.usersRepository.findBirthdayUsers(sendScheduleAt);

    /**
     * Limit 50 API calls per queue to reduce server load
     * Use Promise.all to send queue messages concurrently
     */
    const { length } = users;
    const apiCallsPerQueue = this.API_CALLS_PER_QUEUE;
    const queueCount = Math.ceil(length / apiCallsPerQueue);

    for (let i = 0; i < queueCount; i++) {
      const start = i * apiCallsPerQueue;
      const end = (i + 1) * apiCallsPerQueue;
      const queueUsers = users.slice(start, end);

      const sendMessagePromises = queueUsers.map((user) => {
        const birthdayMessage = this.getBirthdayMessage(
          user.firstName,
          user.lastName,
        );

        return this.sendMessage(
          user.id,
          sendScheduleAt,
          MessageType.BIRTHDAY,
          birthdayMessage,
        );
      });

      await Promise.all(sendMessagePromises);

      // Sent counter
      const counter = length < end ? length : end;
      console.log(`Sent: ${counter} / ${length}`);
    }
  }

  async resendUnsentBirthdayMessages() {
    const messages = await this.messagesRepository.findAllUnsentMessages();

    /**
     * Limit 50 API calls per queue to reduce server load
     * Use Promise.all to send queue messages concurrently
     */
    const { length } = messages;
    const apiCallsPerQueue = this.API_CALLS_PER_QUEUE;
    const queueCount = Math.ceil(length / apiCallsPerQueue);

    for (let i = 0; i < queueCount; i++) {
      const start = i * apiCallsPerQueue;
      const end = (i + 1) * apiCallsPerQueue;
      const queueMessages = messages.slice(start, end);

      const sendMessagePromises = queueMessages.map((message) => {
        const birthdayMessage = this.getBirthdayMessage(
          message.user.firstName,
          message.user.lastName,
        );

        return this.postSendMessageApi(message.id, birthdayMessage);
      });

      await Promise.all(sendMessagePromises);

      // Sent counter
      const counter = length < end ? length : end;
      console.log(`Sent: ${counter} / ${length}`);
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
