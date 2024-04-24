import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateContractDto {
  @ApiProperty({ example: 1 })
  client_code: number;

  @ApiProperty({ example: 1 })
  employee_code: number;

  @ApiProperty({ example: 1 })
  credit_code: number;

  @ApiProperty({ example: 1300000 })
  contract_amount: Decimal;

  @ApiProperty({ example: 60 })
  contract_term: number;

  @ApiProperty({ example: 22776 })
  monthly_payment: Decimal;
}
