import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './create-employee.dto';
import { UpdateEmployeeDto } from './update-employee.dto';
import { PrismaService } from 'src/utils/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private db: PrismaService) {}
  async create(body: CreateEmployeeDto) {
    const checkExistPhoneNumber = await this.db.employee.findFirst({
      where: { phone_number: body?.phone_number },
    });
    if (checkExistPhoneNumber) {
      throw new ConflictException(
        'Для создания сотрудника используйте уникальный номер телефона',
      );
    }
    const employer = await this.db.employee.create({
      data: { ...body },
    });

    return employer;
  }

  async findAll() {
    const employees = await this.db.employee.findMany();
    return employees;
  }

  async findOne(id: number) {
    const employer = await this.db.employee.findFirst({
      where: { employee_code: id },
    });
    return employer;
  }

  async update(id: number, body: UpdateEmployeeDto) {
    const updatedEmployer = await this.db.employee.update({
      where: { employee_code: id },
      data: { ...body },
    });
    if (!updatedEmployer) {
      throw new NotFoundException('Employer not found');
    }
    return updatedEmployer;
  }

  async remove(id: number) {
    const employer = await this.db.employee.findUnique({
      where: { employee_code: id },
      include: { contract: true },
    });

    if (employer) {
      if (employer.contract.length > 0) {
        throw new ConflictException(
          `Работодатель ${
            employer.surname + ' ' + employer.name
          } имеет активные кредиты. Его нельзя удалить. (Сначала удалите контракты связанные с этим работодателем)`,
        );
      }

      const deletedEmployer = await this.db.employee.delete({
        where: { employee_code: id },
      });
      return `Работодатель ${
        deletedEmployer.surname + ' ' + deletedEmployer.name
      } успешно удален, и контракты, связанные с ним, также удалены.`;
    }

    throw new NotFoundException(`Работодатель ${id} не найден.`);
  }
}
