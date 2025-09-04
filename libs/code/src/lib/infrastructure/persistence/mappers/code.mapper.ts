import { Code } from '../../../domain/code';
import { CodeEntity } from '../entities/code.entity';

export class CodeMapper {
  static toDomain(raw: CodeEntity): Code {
    const code = new Code();
    code.id = raw.id;
    code.code = raw.code;
    code.codeType = raw.codeType;
    code.userId = raw.userId;
    code.userType = raw.userType;
    code.createdAt = raw.createdAt;
    return code;
  }

  static toPersistence(code: Code): CodeEntity {
    const coreEntity = new CodeEntity();
    coreEntity.id = code.id;
    coreEntity.code = code.code;
    coreEntity.codeType = code.codeType;
    coreEntity.userId = code.userId;
    coreEntity.userType = code.userType;
    return coreEntity;
  }
}
