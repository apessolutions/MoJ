import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { UserTypeEnum } from '@./common/enums/user-type.enum';
import { NullableType } from '@./common/types/nullable.type';

@Schema({ timestamps: true, collection: 'audit_trails' })
export class AuditTrailModel extends Document {
  @Prop({ type: Object, required: false })
  oldValue!: Record<any, any>;

  @Prop({ type: Object, required: false })
  newValue!: Record<any, any>;

  @Prop({ type: String, required: true })
  event!: string;

  @Prop({ type: Number, default: null })
  userId!: NullableType<number>;

  @Prop({ type: String, default: UserTypeEnum.SYSTEM })
  userType!: string;

  @Prop({ type: Number, required: true })
  recordId!: number;

  @Prop({ type: String, required: true })
  recordType!: string;

  @Prop({ type: String, required: false })
  ipAddress!: string;

  @Prop({ type: String, required: false })
  userAgent!: string;

  @Prop()
  createdAt!: Date;

  @Prop()
  updatedAt!: Date;
}

export const AuditTrailSchema = SchemaFactory.createForClass(AuditTrailModel);
