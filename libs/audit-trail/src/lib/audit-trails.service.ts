import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditTrailModel } from './schemas/audit-trail.schema';
import { AuditTrail } from './domain/audit-trail';
import { ContextProvider } from '@./common/providers/context.provider';

@Injectable()
export class AuditTrailsService {
  constructor(
    @InjectModel(AuditTrailModel.name)
    private readonly auditTrailModel: Model<AuditTrailModel>
  ) {}

  async create(data: AuditTrail): Promise<AuditTrailModel> {
    const auditTrail = new this.auditTrailModel({
      ...data,
      ipAddress: ContextProvider.getIPAddress(),
      userAgent: ContextProvider.getUserAgent(),
    });
    return await auditTrail.save();
  }

  async findRecordAuditTrails(
    recordId: number,
    recordType: any
  ): Promise<AuditTrailModel[]> {
    return await this.auditTrailModel
      .find({
        recordId,
        recordType,
      })
      .exec();
  }

  async findUserAuditTrails(
    userId: number,
    userType: any
  ): Promise<AuditTrailModel[]> {
    return await this.auditTrailModel
      .find({
        userId,
        userType,
      })
      .exec();
  }
}
