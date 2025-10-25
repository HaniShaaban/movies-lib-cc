import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma'; // relative to src

const prisma = new PrismaClient();

@Global()
@Module({
  providers: [{ provide: PrismaClient, useValue: prisma }],
  exports: [PrismaClient],
})
export class PrismaModule {}
