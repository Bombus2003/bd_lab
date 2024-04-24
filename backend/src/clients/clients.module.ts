import { Module } from '@nestjs/common';
import { ClientsService } from './dto/clients.service.dto';
import { ClientsController } from './clients.controller';
import { PrismaService } from 'src/utils/prisma.service';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService, PrismaService],
})
export class ClientsModule {}
