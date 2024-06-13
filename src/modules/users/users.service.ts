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

    const createdUser = await this.usersRepository.create({
      ...createUserDto,
      birthdayAt,
    });

    return { userId: createdUser.id };
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    /**
     * Will need to recalculate birthdayAt based on new location and/or birthDate
     */
    const recalculateBirthdayAt = () => {
      // Updated birthDate & location
      if (updateUserDto.birthDate && updateUserDto.location) {
        return this.getBirthday(
          updateUserDto.birthDate,
          updateUserDto.location,
        );
      }

      // Updated birthDate only
      if (updateUserDto.birthDate) {
        return this.getBirthday(updateUserDto.birthDate, user.location);
      }

      // Updated location only
      if (updateUserDto.location) {
        return this.getBirthday(user.birthDate, updateUserDto.location);
      }

      // If both not updated, return current user birthDay
      return user.birthdayAt;
    };

    const birthdayAt = recalculateBirthdayAt();

    await this.usersRepository.update(userId, {
      ...updateUserDto,
      birthdayAt,
    });

    return { userId };
  }

  async remove(userId: string) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
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
