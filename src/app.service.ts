import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  statusCheck() {
    return { status: 'ok' };
  }
}
