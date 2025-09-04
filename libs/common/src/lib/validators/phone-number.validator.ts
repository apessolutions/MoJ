import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneNumberUtil = PhoneNumberUtil.getInstance();

@ValidatorConstraint({ async: false })
export class IsValidPhoneNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(phoneNumber: string, args: ValidationArguments) {
    try {
      const parsedPhoneNumber = phoneNumberUtil.parseAndKeepRawInput(
        `${phoneNumber}`,
        '',
      );
      return phoneNumberUtil.isValidNumber(parsedPhoneNumber);
    } catch (error) {
      return false;
    }
  }
}

export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: 'Phone number is invalid',
      },
      constraints: [],
      validator: IsValidPhoneNumberConstraint,
    });
  };
}
