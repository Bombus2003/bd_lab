import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private db: PrismaService) {}

  async create(body) {
    const checkExistPhoneNumber = await this.db.$queryRaw`
      SELECT * FROM employee WHERE phone_number = ${body?.phone_number}
    `;

    if (checkExistPhoneNumber) {
      throw new ConflictException(
        'Для создания сотрудника используйте уникальный номер телефона',
      );
    }

    const employer = await this.db.$queryRaw`
      INSERT INTO employee (${Object.keys(body).join(', ')})
      VALUES (${Object.values(body)
        .map((value) => `'${value}'`)
        .join(', ')})
      RETURNING *
    `;
    return employer[0];
  }

  async findAll() {
    return this.db.$queryRaw`SELECT * FROM employee`;
  }

  async findOne(id: number) {
    return this.db
      .$queryRaw`SELECT * FROM employee WHERE employee_code = ${id}`;
  }

  async update(id: number, body) {
    const updatedEmployer = await this.db.$queryRaw`
      UPDATE employee
      SET ${Object.keys(body).map((key) => `${key} = '${body[key]}'`)}
      WHERE employee_code = ${id}
      RETURNING *
    `;
    if (!updatedEmployer) {
      throw new NotFoundException('Employer not found');
    }
    return updatedEmployer[0];
  }

  async remove(id: number) {
    const employer = await this.db.$queryRaw`
      SELECT * FROM employee WHERE employee_code = ${id}
    `;

    if (employer) {
      if (employer[0].contract.length > 0) {
        throw new ConflictException(
          `Работодатель ${
            employer[0].surname + ' ' + employer[0].name
          } имеет активные кредиты. Его нельзя удалить.`,
        );
      }

      await this.db.$queryRaw`
        DELETE FROM employee WHERE employee_code = ${id}
      `;

      return `Работодатель ${
        employer[0].surname + ' ' + employer[0].name
      } успешно удален`;
    }

    throw new NotFoundException(`Работодатель ${id} не найден.`);
  }
}
