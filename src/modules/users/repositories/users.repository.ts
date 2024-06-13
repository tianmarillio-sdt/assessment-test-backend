import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, User } from '@prisma/client';
import { DateService } from 'src/utils/date/date.service';

@Injectable()
export class UsersRepository {
  constructor(
    private prisma: PrismaService,
    private dateService: DateService,
  ) {}

  async create(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({
      data,
    });
  }

  async findAll(query: Prisma.UserFindManyArgs = {}) {
    return await this.prisma.user.findMany(query);
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async findBirthdayUsers(sendScheduleAt: string) {
    /**
     * Note: sendScheduleAt should be based on UTC
     */
    const parseResult = this.dateService.parseDateStringUTC(sendScheduleAt);

    const users: User[] = await this.prisma.$queryRaw`
      SELECT
        *
      FROM "User"
      WHERE
        EXTRACT(MONTH FROM "birthdayAt") = ${parseResult.month} AND
        EXTRACT(DAY FROM "birthdayAt") = ${parseResult.day} AND
        EXTRACT(HOUR FROM "birthdayAt") = ${parseResult.hour} AND
        EXTRACT(MINUTE FROM "birthdayAt") = ${parseResult.minute}
      ;
    `;

    return users;
  }
}
