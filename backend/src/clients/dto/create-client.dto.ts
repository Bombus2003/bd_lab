import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'Зайцев' })
  @IsString()
  @Length(3, 20, { message: 'Длина должна быть от 3 до 20 символов' })
  surname: string;
  @ApiProperty({ example: 'Сергей' })
  @IsString()
  @Length(3, 15, { message: 'Длина должна быть от 3 до 15 символов' })
  name: string;
  @ApiProperty({ example: 'Николаевич' })
  @IsString()
  @Length(3, 20, { message: 'Длина должна быть от 3 до 20 символов' })
  lastname: string;
  @ApiProperty({ example: '2000-06-02' })
  birthday: string;
  @ApiProperty({ example: '384683948' })
  @IsString()
  @Length(11, 11, { message: 'Длина должна быть 11 символов' })
  passport_data: string;
  @ApiProperty({ example: 60000 })
  salary: string;
  @ApiProperty({ example: 'СургутНефтеГаз' })
  @IsString()
  workplace: string;
  @ApiProperty({ example: 'ул. Дзержинского, д.8' })
  @IsString()
  address: string;
  @ApiProperty({ example: '(982)736-45-93' })
  @IsString()
  phone_number?: string;
}
