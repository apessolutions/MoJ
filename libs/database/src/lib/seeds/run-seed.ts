import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AdminSeeder } from '../../../../admin/src/lib/infrastructure/persistence/seeds/admin.seeder';

const runSeed = async () => {
  initializeTransactionalContext();

  const app = await NestFactory.create(SeedModule);

  const seeders = [AdminSeeder];

  for (const seeder of seeders) {
    await app.get(seeder).run();
  }

  await app.close();
};

void runSeed();
