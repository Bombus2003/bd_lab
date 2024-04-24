import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { EmployeesModule } from './employees/employees.module';
import { ContractsModule } from './contracts/contracts.module';
import { CreditModule } from './credit/credit.module';

@Module({
  imports: [ClientsModule, EmployeesModule, ContractsModule, CreditModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
