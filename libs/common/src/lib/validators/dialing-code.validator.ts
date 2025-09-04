import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
export function IsValidDialingCode(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidDialingCode',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: 'Dialing code is invalid',
      },
      validator: {
        validate(value: string, _args: ValidationArguments) {
          try {
            return /^\+\d{1,3}$/.test(value);
          } catch (error) {
            return false;
          }
        },
      },
    });
  };
}
