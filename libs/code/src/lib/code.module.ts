import { Module } from '@nestjs/common';

import { CodeService } from './application/services/code.service';
import { CodePersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [CodePersistenceModule],
  providers: [CodeService],
  exports: [CodePersistenceModule, CodeService],
})
export class CodeModule {}
