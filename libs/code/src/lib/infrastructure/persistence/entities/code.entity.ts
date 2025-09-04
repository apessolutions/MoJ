import { Column, Entity } from 'typeorm';
import { EntityHelper } from '../../../../../../common/src/lib/entities/entity-helper';
import { UserTypeEnum } from '@./common/enums/user-type.enum';
import { CodeTypeEnum } from '@./code/enums/code-type.enum';

@Entity({
  name: 'code',
})
export class CodeEntity extends EntityHelper {
  @Column({ type: 'varchar' })
  code!: string;

  @Column({ type: 'int' })
  userId!: number;

  @Column({ type: 'enum', enum: UserTypeEnum })
  userType!: UserTypeEnum;

  @Column({ type: 'enum', enum: CodeTypeEnum })
  codeType!: CodeTypeEnum;
}
