import { Module } from '@nestjs/common';
import { EmployeesService } from './dto/employees.service.dto';
import { EmployeesController } from './employees.controller';
import { PrismaService } from 'src/utils/prisma.service';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService, PrismaService],
})
export class EmployeesModule {}
