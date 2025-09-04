import { Module } from '@nestjs/common';

import { FileModule as RootFileModule } from '@./file/file.module';

@Module({
  imports: [RootFileModule.register()],
  controllers: [],
  providers: [],
})
export class FileModule {}
