import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCreditDto } from './create-credit.dto';
import { UpdateCreditDto } from './update-credit.dto';
import { PrismaService } from 'src/utils/prisma.service';

@Injectable()
export class CreditService {
  constructor(private db: PrismaService) {}
  async create(body: CreateCreditDto) {
    const credit = await this.db.credit.create({
      data: {
        ...body,
      },
    });

    return credit;
  }

  async findAll() {
    const credits = await this.db.credit.findMany();
    return credits;
  }

  async findOne(id: number) {
    const credit = await this.db.credit.findFirst({
      where: { credit_code: id },
    });
    return credit;
  }

  async update(id: number, body: UpdateCreditDto) {
    const updatedCredit = await this.db.credit.update({
      where: { credit_code: id },
      data: body,
    });
    if (!updatedCredit) {
      throw new NotFoundException('Credit not found');
    }
    return updatedCredit;
  }

  async remove(id: number) {
    const credit = await this.db.credit.findUnique({
      where: { credit_code: id },
      include: { contract: true },
    });

    if (credit) {
      if (credit.contract.length > 0) {
        throw new ConflictException(
          `Кредит ${credit.credit_name} имеет активные договоры. Его нельзя удалить. (Сначала удалите договоры связанные с этим кредитом)`,
        );
      }

      const deletedСredit = await this.db.credit.delete({
        where: { credit_code: id },
      });
      return `Кредит ${deletedСredit.credit_name} успешно удален.`;
    }

    throw new NotFoundException(`Кредит ${id} не найден.`);
  }
}
