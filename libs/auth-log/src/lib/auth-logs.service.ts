import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthLogModel } from './schemas/auth-log.schema';
import { AuthLog } from './domain/auth-log';
import { isDefined } from 'class-validator';
import { ContextProvider, UserTypeEnum } from '@./common';

@Injectable()
export class AuthLogsService {
  constructor(
    @InjectModel(AuthLogModel.name)
    private readonly authLogModel: Model<AuthLogModel>
  ) {}

  async create(data: AuthLog) {
    const authLog = new this.authLogModel({
      ...data,
      ipAddress: ContextProvider.getIPAddress(),
      userAgent: ContextProvider.getUserAgent(),
    });
    return await authLog.save();
  }

  async logout(userId: number, userType: UserTypeEnum) {
    if (
      isDefined(ContextProvider.getIPAddress()) &&
      isDefined(ContextProvider.getUserAgent())
    ) {
      const ipAddress = ContextProvider.getIPAddress();
      const userAgent = ContextProvider.getUserAgent();

      if (ipAddress && userAgent) {
        await this.authLogModel
          .findOneAndUpdate(
            { ipAddress, userAgent, userId, userType },
            { logoutAt: new Date(Date.now()) },
            { sort: { loginAt: -1 } }
          )
          .exec();
      }
    }
  }
}
