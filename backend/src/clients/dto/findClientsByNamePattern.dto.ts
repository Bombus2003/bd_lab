import { ApiProperty } from '@nestjs/swagger';

export class FindClientsByNamePatternDto {
  @ApiProperty({ example: 'АБВГД' })
  pattern: string;
}
