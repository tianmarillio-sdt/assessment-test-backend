import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

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

  async findBirthdayUsers({
    month,
    day,
    hour,
    minute,
  }: {
    month: number;
    day: number;
    hour: number;
    minute: number;
  }) {
    /**
     * Note: input should be based on UTC
     */
    const users: User[] = await this.prisma.$queryRaw`
      SELECT
        *
      FROM "User"
      WHERE
        EXTRACT(MONTH FROM "birthdayAt") = ${month} AND
        EXTRACT(DAY FROM "birthdayAt") = ${day} AND
        EXTRACT(HOUR FROM "birthdayAt") = ${hour} AND
        EXTRACT(MINUTE FROM "birthdayAt") = ${minute}
      ;
    `;

    return users;
  }
}
