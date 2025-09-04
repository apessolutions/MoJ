import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { DataSource } from 'typeorm';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ContextProvider } from '../../../../../common/src/lib/providers/context.provider';
import { IParamRequest } from '@./common/interfaces/IParam.interface';
import { capitalize } from '../../../../../common/src/lib/transformers/capitalize.transformer';

type ValidationEntity =
  | {
      id?: number | string;
    }
  | undefined;

@Injectable()
@ValidatorConstraint({ name: 'IsNotExist', async: true })
export class IsNotExistConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    const options = validationArguments
      .constraints[0] as NotExistsValidationOptions;
    const repository = options.table;
    const column = options.column || 'id';
    let paramKey: string | null = null;
    let param: IParamRequest | undefined = undefined;
    if (options.ignoreColumn != null) {
      paramKey = options.ignoreColumn;
      param = ContextProvider.getParams().find(
        (param) => param.key == paramKey
      );
    }

    const entity = (await this.dataSource
      .getRepository(repository)
      .createQueryBuilder(`${repository}`)
      .where(`${repository}.${column} = :value`, {
        value: value,
      })
      .getOne()) as ValidationEntity;

    if (entity?.id == param?.value) {
      return true;
    }

    return !entity;
  }
}

type NotExistsValidationOptions = {
  table: string;
  column?: string;
  ignoreColumn?: string;
};

export function IsNotExists(
  existsValidationOptions: NotExistsValidationOptions,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: `${capitalize(
          existsValidationOptions.column!
        )} already exists`,
        ...validationOptions,
      },
      constraints: [existsValidationOptions],
      validator: IsNotExistConstraint,
    });
  };
}
