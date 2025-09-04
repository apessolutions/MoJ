/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @nx/enforce-module-boundaries */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { isDefined } from 'class-validator';
import { In } from 'typeorm';

import { Admin } from '../../domain/admin';
import { AdminRepository } from '../ports/admin.repository';

import { ResponseMessage } from '@./common/enums/response-message.enum';
import { ResponseStatus } from '@./common/enums/response-status.enum';
import { FindConfig } from '@./common/types/query.type';
import { CreateAdminDto, UpdateAdminDto } from '@./contract';
import { RoleRepository } from '@./role/application/ports/role.repository';
import { SessionService } from '../../../../../session/src/lib/application/services/session.service';
import { UserTypeEnum } from '@./common/enums/user-type.enum';

@Injectable()
export class AdminService {
  constructor(
    private adminRepository: AdminRepository,
    private readonly roleRepository: RoleRepository,
    private readonly sessionService: SessionService
  ) {}

  async updateAdmin(id: number, updateAdminDto: UpdateAdminDto) {
    const admin = await this.findById(id);

    const { roleIds, status, ...rest } = updateAdminDto;

    if (isDefined(status)) {
      // If we deactivate the admin remove all sessions
      if (!status) {
        await this.sessionService.delete({
          userId: admin.id,
          userType: UserTypeEnum.ADMIN,
        });
      }
      admin.status = status;
    }

    Object.keys(rest).map((key: string) => {
      // @ts-ignore
      if (isDefined(rest[key])) {
        // @ts-ignore
        admin[key] = rest[key];
      }
    });

    if (isDefined(roleIds)) {
      const roles = await this.roleRepository.findMany({
        id: In(roleIds),
      });

      if (roles.length !== roleIds.length) {
        throw new NotFoundException('Role not found');
      }

      admin.roles = roles;
    }

    return await this.adminRepository.update(admin);
  }

  async create(createAdminDto: CreateAdminDto) {
    const { roleIds, ...rest } = createAdminDto;

    const roles = await this.roleRepository.findMany({
      id: In(roleIds),
    });

    if (roles.length !== roleIds.length) {
      throw new NotFoundException('Role not found');
    }

    const admin = await this.adminRepository.create({
      ...rest,
      roles,
      status: true,
      isSuper: createAdminDto.isSuper || false,
    });

    return admin;
  }

  async findAll(config: FindConfig<Admin>) {
    const result = await this.adminRepository.findManyWithPagination({
      filters: {},
      config,
    });

    return result;
  }

  async findById(id: number) {
    const admin = await this.adminRepository.findOne({ id: id });
    if (!admin) {
      throw new HttpException(
        ResponseMessage.notFound,
        ResponseStatus.notFound
      );
    }
    return admin;
  }

  async delete(id: number) {
    const admin = await this.findById(id);
    return await this.adminRepository.softDelete(admin.id);
  }

  async list() {
    return await this.adminRepository.findMany({});
  }
}
