import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Зулина' })
  @IsString()
  @Length(3, 20, { message: 'Длина должна быть от 3 до 20 символов' })
  surname: string;
  @ApiProperty({ example: 'Наталья' })
  @IsString()
  @Length(3, 15, { message: 'Длина должна быть от 3 до 15 символов' })
  name: string;
  @ApiProperty({ example: 'Евгеньевна' })
  @IsString()
  @Length(3, 20, { message: 'Длина должна быть от 3 до 20 символов' })
  lastname: string;
  @ApiProperty({ example: 'Сотрудник кредитного отдела' })
  @IsString()
  @Length(1, 50, { message: 'Длина должна быть до 50 символов' })
  position: string;
  @ApiProperty({ example: '(982)736-45-93' })
  @IsString()
  phone_number?: string;
}
