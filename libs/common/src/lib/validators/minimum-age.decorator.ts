/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsMinimumAge(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'isMinimumAge',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (!(value instanceof Date)) {
            return false;
          }

          const currentDate = new Date();
          const minimumAgeDate = new Date(
            currentDate.getFullYear() - 9,
            currentDate.getMonth(),
            currentDate.getDate(),
          );
          return value <= minimumAgeDate;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be at least 9 years old`;
        },
      },
    });
  };
}
