import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ name: 'IsExist', async: true })
export class IsExistConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    const options = validationArguments
      .constraints[0] as ExistsValidationOptions;
    const repository = options.table;
    const column = options.column;
    const entity = await this.dataSource
      .getRepository(repository)
      .createQueryBuilder(`${repository}`)
      .where(`${repository}.${column} = :value`, {
        value: value,
      })
      .getOne();

    return Boolean(entity);
  }
}

type ExistsValidationOptions = {
  table: string;
  column: string;
};

export function IsExists(
  existsValidationOptions: ExistsValidationOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [existsValidationOptions],
      validator: IsExistConstraint,
    });
  };
}
