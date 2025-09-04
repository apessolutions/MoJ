/* eslint-disable @nx/enforce-module-boundaries */
import { instanceToPlain } from 'class-transformer';
import {
  AfterLoad,
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IAuditable } from '../../../../audit-trail/src/lib/interfaces/auditable.interface';
import { MaybeType } from '../types/maybe.type';

export class BaseEntityHelper extends BaseEntity {
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    type: 'timestamp with time zone',
  })
  deletedAt: MaybeType<Date>;
}

export class EntityHelper extends BaseEntityHelper implements IAuditable {
  __entity?: string;

  @PrimaryGeneratedColumn()
  id!: number;

  @AfterLoad()
  setEntityName() {
    this.__entity = this.constructor.name;
  }

  getResource(): string {
    return this.constructor.name;
  }

  getId(): number {
    return this.id;
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
