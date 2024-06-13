import { Module } from '@nestjs/common';
import { SendMessageApiService } from './send-message-api.service';

@Module({
  providers: [SendMessageApiService],
  exports: [SendMessageApiService],
})
export class ApisModule {}
