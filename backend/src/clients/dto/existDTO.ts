import { ApiProperty } from '@nestjs/swagger';

export class ExistsAddressDto {
  @ApiProperty({ example: 'ул. Гагарина, д.5' })
  address: string;
}
