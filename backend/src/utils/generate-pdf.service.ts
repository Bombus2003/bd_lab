import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import * as fs from 'fs';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';

interface IContractData {
  contract_code: number;
  contract_term: number;
  contract_amount: Decimal;
  creation_date: Date;
  monthly_payment: Decimal;
  client_code: number;
  credit_code: number;
  employee_code: number;
  clients: {
    surname: string;
    name: string;
    lastname: string;
    phone_number: string;
    passport_data: string;
  };
  employees: {
    surname: string;
    name: string;
    lastname: string;
    phone_number: string;
  };
  credit: {
    credit_name: string;
    interest_rate: Decimal;
  };
}

@Injectable()
export class GeneratePdfService {
  async generatePDF(contractData: IContractData): Promise<string> {
    const doc = new PDFDocument();
    const filename = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      `${contractData.contract_code}.pdf`,
    );
    const stream = fs.createWriteStream(filename);

    doc.pipe(stream);
    const fontPath = path.join(__dirname, '..', '..', 'fonts', 'arial.ttf');
    doc.font(fontPath);

    doc
      .fontSize(14)
      .text('Данные контракта:', { align: 'center', lineGap: 20 });

    // Выводим основные данные контракта
    doc.fontSize(12).text(`Код контракта: ${contractData.contract_code}`);
    doc.fontSize(12).text(`Сумма контракта: ${contractData.contract_amount}₽`);
    doc
      .fontSize(12)
      .text(`Срок контракта (месяцы): ${contractData.contract_term}`);
    doc
      .fontSize(12)
      .text(`Ежемесячный платеж: ${contractData.monthly_payment}`);
    // Выводим таблицу с оплатами
    doc.fontSize(14).text('Таблица оплат:', { align: 'center', lineGap: 20 });

    // Заголовок таблицы
    doc.fontSize(12).text('Месяц', 200, doc.y, { width: 100, align: 'center' });
    doc
      .fontSize(12)
      .text('Сумма оплаты', 200, doc.y, { width: 100, align: 'center' });

    // Линии между заголовком и данными таблицы
    doc
      .moveTo(50, doc.y + 10)
      .lineTo(200, doc.y + 10)
      .stroke();

    // Данные таблицы
    for (let i = 1; i <= contractData.contract_term; i++) {
      const paymentDate = new Date(contractData.creation_date);
      paymentDate.setMonth(paymentDate.getMonth() + i);
      const formattedDate = paymentDate.toLocaleDateString('ru-RU');

      // Линии между данными таблицы
      doc
        .moveTo(50, doc.y + 10)
        .lineTo(400, doc.y + 10)
        .stroke();

      doc.moveDown(); // Переход на следующую строку для новых данных
      doc
        .fontSize(12)
        .text(formattedDate, 200, doc.y, { width: 100, align: 'center' });
      doc.fontSize(12).text(`${contractData.monthly_payment}₽`, 200, doc.y, {
        width: 100,
        align: 'center',
      });
    }

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(filename));
      stream.on('error', reject);
    });
  }
}
