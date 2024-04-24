import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class ClientsWithPayoutBetweenDto {
  @ApiProperty({ example: '0' })
  @IsNumber()
  min: number;
  @ApiProperty({ example: '10' })
  @IsNumber()
  max: number;
}
