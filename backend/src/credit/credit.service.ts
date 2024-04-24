import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';

@Injectable()
export class CreditService {
  constructor(private db: PrismaService) {}

  async create(body) {
    const credit = await this.db.$queryRaw`
      INSERT INTO credit (${Object.keys(body).join(', ')})
      VALUES (${Object.values(body)
        .map((value) => `'${value}'`)
        .join(', ')})
      RETURNING *
    `;
    return credit[0];
  }

  async findAll() {
    return this.db.$queryRaw`SELECT * FROM credit`;
  }

  async findOne(id: number) {
    return this.db.$queryRaw`SELECT * FROM credit WHERE credit_code = ${id}`;
  }

  async update(id: number, body) {
    const updatedCredit = await this.db.$queryRaw`
      UPDATE credit
      SET ${Object.keys(body).map((key) => `${key} = '${body[key]}'`)}
      WHERE credit_code = ${id}
      RETURNING *
    `;

    return updatedCredit[0];
  }

  async remove(id: number) {
    const credit = await this.db.$queryRaw`
      SELECT * FROM credit WHERE credit_code = ${id}
    `;

    if (credit) {
      await this.db.$queryRaw`
        DELETE FROM credit WHERE credit_code = ${id}
      `;

      return `Кредит ${credit[0].credit_name} успешно удален.`;
    }

    throw new NotFoundException(`Кредит ${id} не найден.`);
  }
}
