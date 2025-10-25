// prisma/seed.ts
import { NestFactory } from '@nestjs/core';
import { SeederModule } from '../src/seeder/seeder.module';
import { SeederService } from '../src/seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  const seeder = app.get(SeederService);

  await seeder.run();

  await app.close();
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});

// npx ts-node  prisma/seed.ts
