import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { DateService } from 'src/utils/date/date.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private dateService: DateService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const birthdayAt = this.getBirthday(
      createUserDto.birthDate,
      createUserDto.location,
    );

    // FIXME: remove console logs
    // FIXME: remove comments
    // TODO: PATCH

    const createdUser = await this.usersRepository.create({
      ...createUserDto,
      birthdayAt,
    });

    return { userId: createdUser.id };
  }

  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async remove(userId: string) {
    const foundUser = await this.usersRepository.findById(userId);

    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.usersRepository.remove(userId);

    return { userId };
  }

  private getBirthday(birthDate: string, location: string) {
    const parsed = this.dateService.parseDateOnlyStringByTimeZone(
      birthDate,
      location,
    );

    // Add 9 hours for 09:00 am notification
    const added9HoursDateString = this.dateService.addHours(parsed, 9);

    return added9HoursDateString;
  }
}
