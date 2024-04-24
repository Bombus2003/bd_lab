import { Module } from '@nestjs/common';
import { CreditService } from './dto/credit.service.dto';
import { CreditController } from './credit.controller';
import { PrismaService } from 'src/utils/prisma.service';

@Module({
  controllers: [CreditController],
  providers: [CreditService, PrismaService],
})
export class CreditModule {}
