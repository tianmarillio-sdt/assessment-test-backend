import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/user.repository';
import { DateService } from 'src/utils/date/date.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UsersRepository,
    private dateService: DateService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const birthDate = this.getBirthDate(
      createUserDto.birthDate,
      createUserDto.location,
    );

    console.log({ location: createUserDto.location, birthDate });

    const createdUser = await this.userRepository.create({
      ...createUserDto,
      birthDate,
    });

    return { userId: createdUser.id };
  }

  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async remove(userId: string) {
    const foundUser = await this.userRepository.findById(userId);

    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.remove(userId);

    return { userId };
  }

  private getBirthDate(birthDateString: string, location: string) {
    const parsed = this.dateService.parseDateStringByTimeZone(
      birthDateString,
      location,
    );

    // Add 9 hours for 09:00 am notification
    const added9HoursDateString = this.dateService.addHours(parsed, 9);

    return added9HoursDateString;
  }
}
