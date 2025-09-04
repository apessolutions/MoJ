/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @nx/enforce-module-boundaries */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isDefined } from 'class-validator';

import { PageOptionsDto } from '../../../../../contract/src/lib/common/page-option.dto';
import { RoleRepository } from '../ports/role.repository';

import { CreateRoleDto, UpdateRoleDto } from '@./contract';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async findById(id: number) {
    const role = await this.roleRepository.findOne({ id });

    if (!role) {
      throw new NotFoundException(`Role with is not found`);
    }

    return role;
  }

  async create(data: CreateRoleDto) {
    const role = await this.roleRepository.create(data);
    return role;
  }

  async update(id: number, data: UpdateRoleDto) {
    const role = await this.findById(id);

    Object.keys(data).forEach((key) => {
      //@ts-ignore
      if (isDefined(data[key])) {
        //@ts-ignore
        role[key] = data[key];
      }
    });

    const updatedRole = await this.roleRepository.update(role);
    return updatedRole;
  }

  async findAll(config: PageOptionsDto) {
    return await this.roleRepository.findManyWithPagination({
      config,
      filters: {},
    });
  }

  async list() {
    return await this.roleRepository.findMany({});
  }

  async delete(id: number) {
    const role = await this.findById(id);

    const roleAssignedToAdmins = await this.roleRepository.roleAssignedToAdmins(
      role.id
    );

    if (roleAssignedToAdmins)
      throw new BadRequestException(
        `Some admins have this role you cannot delete it`
      );

    await this.roleRepository.delete(role.id);
  }
}
