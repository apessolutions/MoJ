import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { NullableType, UserTypeEnum } from '@./common';

@Schema({ timestamps: true, collection: 'auth_logs' })
export class AuthLogModel extends Document {
  @Prop({ type: Number, default: null })
  userId!: NullableType<number>;

  @Prop({ type: String, default: UserTypeEnum.SYSTEM })
  userType!: string;

  @Prop({ type: Boolean, required: true, default: false })
  loginSuccessful!: boolean;

  @Prop({ required: false, default: null })
  loginAt?: Date;

  @Prop({ required: false, default: null })
  logoutAt?: Date;

  @Prop({ type: String, required: false, default: null })
  ipAddress!: string;

  @Prop({ type: String, required: false, default: null })
  userAgent!: string;

  @Prop()
  createdAt!: Date;

  @Prop()
  updatedAt!: Date;
}

export const AuthLogSchema = SchemaFactory.createForClass(AuthLogModel);
