import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import otpGenerator from 'otp-generator';
import { Transactional } from 'typeorm-transactional';

import { ICreateCode } from '../../interfaces/create-code.interface';
import { IVerifyCode } from '../../interfaces/verify-code.interface';
import { CodeRepository } from '../ports/code.repository';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { DateOperations } from '@./common/utils/date-operation.utils';

@Injectable()
export class CodeService {
  constructor(private repository: CodeRepository) {}

  private _generateCode() {
    return otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
  }

  async create(createCodeDto: ICreateCode) {
    const code = this._generateCode();
    const newCode = await this.repository.create({
      code,
      codeType: createCodeDto.codeType,
      userId: createCodeDto.userId,
      userType: createCodeDto.userType,
    });

    return newCode;
  }

  async verifyCode(data: IVerifyCode) {
    const code = await this.repository.findOne({
      code: data.code,
      codeType: data.codeType,
      userId: data.userId,
      userType: data.userType,
    });

    if (!code) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid Code',
      });
    }

    if (
      code.createdAt &&
      DateOperations.timePassedDuration(code.createdAt, { minutes: 30 })
    ) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Code is expired',
      });
    }
    return true;
  }
  @Transactional()
  async deleteCode(data: IVerifyCode) {
    const code = await this.repository.findOne({
      code: data.code,
      codeType: data.codeType,
      userId: data.userId,
      userType: data.userType,
    });

    if (!code) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid Code',
      });
    }

    return await this.repository.delete(code.id);
  }
}
