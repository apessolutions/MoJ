import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AdminEntity } from '../entities/admin.entity';

@Injectable()
export class AdminSeeder {
  constructor(
    @InjectRepository(AdminEntity)
    private repository: Repository<AdminEntity>
  ) {}

  async run() {
    const admins = [
      {
        firstName: 'Apes',
        lastName: 'Solutions',
        email: 'apes@apessmartsolutions.com',
      },
    ];

    for (const adminData of admins) {
      const admin = await this.repository.findOne({
        where: {
          email: adminData.email,
        },
      });
      if (admin) {
        return;
      }
      await this.repository.save(
        this.repository.create({
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: adminData.email,
          password: 'apes_2024',
          isSuper: true,
        })
      );
    }
  }
}
