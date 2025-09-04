import { PhoneNumber } from '../../../domain/phone-number';
import { PhoneNumberEntity } from '../entities/phone-number.entity';

export class PhoneNumberMapper {
  static toDomain(raw: PhoneNumberEntity): PhoneNumber {
    const phoneNumber = new PhoneNumber();
    phoneNumber.id = raw.id;
    phoneNumber.codeCreatedAt = raw.codeCreatedAt;
    phoneNumber.phoneNumber = raw.phoneNumber;
    phoneNumber.verificationCode = raw.verificationCode;
    return phoneNumber;
  }

  static toPersistence(phoneNumber: PhoneNumber): PhoneNumberEntity {
    const phoneNumberEntity = new PhoneNumberEntity();
    phoneNumberEntity.id = phoneNumber.id;
    phoneNumberEntity.codeCreatedAt = phoneNumber.codeCreatedAt;
    phoneNumberEntity.phoneNumber = phoneNumber.phoneNumber;
    phoneNumberEntity.verificationCode = phoneNumber.verificationCode;
    return phoneNumberEntity;
  }
}
