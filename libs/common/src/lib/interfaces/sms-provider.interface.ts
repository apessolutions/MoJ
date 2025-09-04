export abstract class SMSProvideService {
  abstract sendSMS(phoneNumber: string, message: string): void;
}
