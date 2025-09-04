import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeEntity } from './entities/code.entity';
import { CodeRelationalRepository } from './repositories/code.repository';
import { CodeRepository } from '../../application/ports/code.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CodeEntity])],
  providers: [
    {
      provide: CodeRepository,
      useClass: CodeRelationalRepository,
    },
  ],
  exports: [CodeRepository],
})
export class CodePersistenceModule {}
