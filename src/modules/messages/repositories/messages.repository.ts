import { Injectable } from '@nestjs/common';
import { MessageType, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class MessagesRepository {
  constructor(private prisma: PrismaService) {}

  readonly MessageType: MessageType;

  async create(data: Prisma.MessageCreateInput) {
    return await this.prisma.message.create({
      data,
    });
  }

  async update(id: string, data: Prisma.MessageUpdateInput) {
    return await this.prisma.message.update({
      where: {
        id,
      },
      data,
    });
  }

  async findAllUnsentMessages() {
    return await this.prisma.message.findMany({
      where: {
        isSent: false,
      },
    });
  }
}
