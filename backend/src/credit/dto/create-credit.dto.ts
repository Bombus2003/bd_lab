import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateCreditDto {
  @ApiProperty({ example: 'Ипотека с господдержкой' })
  credit_name: string;
  @ApiProperty({ example: 500000 })
  min_amount: Decimal;
  @ApiProperty({ example: 60000000 })
  max_amount: Decimal;
  @ApiProperty({ example: 24 })
  min_credit_term: number;
  @ApiProperty({ example: 360 })
  max_credit_term: number;
  @ApiProperty({ example: 6 })
  interest_rate: Decimal;
}
