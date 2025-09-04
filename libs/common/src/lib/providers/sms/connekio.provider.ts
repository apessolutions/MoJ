/*
    OTP: One-time Password Algorithm
    The code here will be changed based on the method you use to generate the OTP later.
*/
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { SMSProvideService } from '../../interfaces/sms-provider.interface';

import { SMSConfig } from '@./config/sms.config';

@Injectable()
@Injectable()
export class ConnekioService implements SMSProvideService {
  constructor(
    private readonly configService: ConfigService<SMSConfig>,
    private readonly httpService: HttpService
  ) {}

  public sendSMS(phoneNumber: string, message: string) {
    firstValueFrom(
      this.httpService.post(
        'https://api.connekio.com/sms/single',
        {
          sender: `${this.configService.get('sms.conneckioSenderName', {
            infer: true,
          })}`,
          msisdn: phoneNumber.replace('+', ''),
          text: message,
          account_id: parseInt(
            this.configService.get('sms.conneckioAccountId', {
              infer: true,
            }) ?? ''
          ),
        },
        {
          headers: {
            Authorization: `Basic ${this.configService.get(
              'sms.conneckioAPIKey',
              { infer: true }
            )}`,
          },
        }
      )
    )
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }
}
