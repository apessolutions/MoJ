import { Injectable, NotFoundException } from '@nestjs/common';

import { FindConfig, IFindOptions } from '@./common/types/query.type';
import { CreateUserDto, UpdateUserDto } from '@./contract';
import { UserRepository } from '@./user/application/ports/user.repository';
import { User } from '@./user/domain/user';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async create(createDto: CreateUserDto) {
    return this.userRepo.create(createDto);
  }

  async update(id: number, updateDto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateDto);

    return this.userRepo.update(user);
  }

  async delete(id: number) {
    return this.userRepo.softDelete(id);
  }

  async restore(id: number) {
    return this.userRepo.restore(id);
  }

  async findOne(filter: IFindOptions<User>) {
    const user = await this.userRepo.findOne(filter);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAll(options: {
    filters: IFindOptions<User>;
    config: FindConfig<User>;
  }) {
    return this.userRepo.findManyWithPagination(options);
  }

  async list(filter: IFindOptions<User>) {
    return this.userRepo.findMany(filter);
  }
}
