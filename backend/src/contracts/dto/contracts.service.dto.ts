import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContractDto } from './create-contract.dto';
import { UpdateContractDto } from './update-contract.dto';
import { PrismaService } from 'src/utils/prisma.service';
import { GeneratePdfService } from 'src/utils/generate-pdf.service';
import { Decimal } from '@prisma/client/runtime/library';
interface ICredit {
  credit_code: number;
  credit_name: string;
  min_amount?: number | null;
  max_amount?: number | null;
  min_credit_term?: number | null;
  max_credit_term?: number | null;
  interest_rate?: number | null;
}
@Injectable()
export class ContractsService {
  constructor(
    private db: PrismaService,
    private genPDF: GeneratePdfService,
  ) {}
  async create(body: CreateContractDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isClient, isСredit, isEmployee] = await Promise.all([
      this.checkIfExists(
        'client',
        'client_code',
        body.client_code,
        'Клиент не найден, договор не создан',
      ),
      this.checkIfExists(
        'credit',
        'credit_code',
        body.credit_code,
        'Кредит не найден, договор не создан',
      ),
      this.checkIfExists(
        'employee',
        'employee_code',
        body.employee_code,
        'Работник не найден, договор не создан',
      ),
    ]);
    await this.checkCreditConstraints(
      isСredit,
      body.contract_term,
      body.contract_amount,
    );

    const monthlyInterestRate = isСredit.interest_rate / 12 / 100;
    const loanTerm = body.contract_term;
    const loanAmount = Number(body.contract_amount);

    const monthlyPayment =
      (loanAmount * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -loanTerm));

    const contract = await this.db.contract.create({
      data: {
        client_code: body.client_code,
        employee_code: body.employee_code,
        credit_code: body.credit_code,
        contract_term: body.contract_term,
        contract_amount: body.contract_amount,
        monthly_payment: monthlyPayment,
      },
      include: {
        clients: true,
        employees: true,
        credit: true,
      },
    });
    await this.genPDF.generatePDF(contract);

    return contract;
  }

  async findAll(startDate: Date, endDate: Date) {
    const contracts = await this.db.contract.findMany({
      where: {
        creation_date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return contracts;
  }

  async findOne(id: number) {
    const contract = await this.db.contract.findFirst({
      where: { contract_code: id },
    });
    return contract;
  }

  async update(id: number, body: UpdateContractDto) {
    const updatedСontract = await this.db.contract.update({
      where: { contract_code: id },
      data: body,
      include: {
        clients: true,
        employees: true,
        credit: true,
      },
    });
    if (!updatedСontract) {
      throw new NotFoundException('Договор не найден');
    }
    // await this.genPDF.generatePDF(updatedСontract);
    return updatedСontract;
  }

  async remove(id: number) {
    const contract = await this.db.contract.findUnique({
      where: { contract_code: id },
    });

    if (contract) {
      const deletedContract = await this.db.contract.delete({
        where: { contract_code: id },
      });
      return `Договор №${deletedContract.contract_code} успешно удален`;
    }
    return null;
  }
  async checkIfExists(model: string, field, value, errorMessage) {
    const result = await this.db[model].findFirst({
      where: {
        [field]: value,
      },
    });
    if (!result) {
      throw new NotFoundException(errorMessage);
    }
    return result;
  }
  async checkCreditConstraints(
    credit: ICredit,
    contractTerm: number,
    contractAmount: Decimal,
  ) {
    const contractAmountValue: number = Number(contractAmount);
    if (
      (credit.min_amount !== null && contractAmountValue < credit.min_amount) ||
      (credit.max_amount !== null && contractAmountValue > credit.max_amount) ||
      (credit.min_credit_term !== null &&
        contractTerm < credit.min_credit_term) ||
      (credit.max_credit_term !== null && contractTerm > credit.max_credit_term)
    ) {
      throw new BadRequestException('Неверные значения для договора');
    }
  }

  async findAllMin(payoutAmount: number) {
    const contracts = await this.db.contract.findMany({
      where: {
        monthly_payment: {
          lte: payoutAmount,
        },
      },
    });
    return contracts;
  }

  async findAllMax(payoutAmount: number) {
    const contracts = await this.db.contract.findMany({
      where: {
        monthly_payment: {
          gte: payoutAmount,
        },
      },
    });
    return contracts;
  }
}
