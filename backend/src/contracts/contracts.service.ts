import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { GeneratePdfService } from 'src/utils/generate-pdf.service';

@Injectable()
export class ContractsService {
  constructor(
    private db: PrismaService,
    private genPDF: GeneratePdfService,
  ) {}

  async create(body) {
    return await this.db.$queryRaw`
      INSERT INTO contract (client_code, employee_code, credit_code, contract_term, contract_amount, monthly_payment)
      VALUES (
        ${body.client_code}, 
        ${body.employee_code}, 
        ${body.credit_code}, 
        ${body.contract_term}, 
        ${body.contract_amount}
      )
    `;
  }

  async findAll(startDate: Date, endDate: Date) {
    return this.db
      .$queryRaw`SELECT * FROM contract WHERE creation_date BETWEEN ${startDate} AND ${endDate}`;
  }

  async findOne(id: number) {
    return this.db
      .$queryRaw`SELECT * FROM contract WHERE contract_code = ${id}`;
  }

  async update(id: number, body) {
    const updatedСontract = await this.db.$queryRaw`
      UPDATE contract
      SET ${Object.keys(body).map((key) => `${key} = ${body[key]}`)}
      WHERE contract_code = ${id}
      RETURNING *
    `;
    if (!updatedСontract) {
      throw new NotFoundException('Договор не найден');
    }
    return updatedСontract[0];
  }

  async remove(id: number) {
    const deletedContract = await this.db.$queryRaw`
      DELETE FROM contract WHERE contract_code = ${id}
      RETURNING *
    `;
    if (!deletedContract) {
      throw new NotFoundException(`Договор №${id} не найден`);
    }
    return `Договор №${id} успешно удален`;
  }

  async checkIfExists(model: string, field, value) {
    const result = await this.db
      .$queryRaw`SELECT * FROM ${model} WHERE ${field} = ${value}`;
    return result[0];
  }

  async findAllMin(payoutAmount: number) {
    return this.db
      .$queryRaw`SELECT * FROM contract WHERE monthly_payment <= ${payoutAmount}`;
  }

  async findAllMax(payoutAmount: number) {
    return this.db
      .$queryRaw`SELECT * FROM contract WHERE monthly_payment >= ${payoutAmount}`;
  }
}
