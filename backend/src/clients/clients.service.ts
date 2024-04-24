import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/utils/prisma.service';
import { ClientsWithPayoutBetweenDto } from './dto/clientsWithPayoutBetween.dto';

@Injectable()
export class ClientsService {
  constructor(private db: PrismaService) {}

  async create(body: CreateClientDto) {
    const client = await this.db.$queryRaw`
      INSERT INTO client (surname, name, lastname, birthday, passport_data, salary, workplace, address, phone_number)
      VALUES (
        ${body.surname}, 
        ${body.name}, 
        ${body.lastname}, 
        ${new Date(body.birthday)}, 
        ${body.passport_data}, 
        ${body.salary}, 
        ${body.workplace}, 
        ${body.address}, 
        ${body.phone_number}
      )
      RETURNING *
    `;

    return client[0];
  }

  async findAll() {
    return this.db.$queryRaw`
      SELECT c.*, SUM(co.monthly_payment) as total_payout
      FROM client c
      JOIN contract co ON c.client_code = co.client_code
      GROUP BY c.client_code
    `;
  }

  async findOne(id: number) {
    return this.db.$queryRaw`
      SELECT * FROM client
      WHERE client_code = ${id}
    `;
  }

  async update(id: number, body: UpdateClientDto) {
    const updatedUser = await this.db.$queryRaw`
      UPDATE client
      SET
        surname = ${body.surname},
        name = ${body.name},
        lastname = ${body.lastname},
        birthday = ${new Date(body.birthday)},
        passport_data = ${body.passport_data},
        salary = ${body.salary},
        workplace = ${body.workplace},
        address = ${body.address},
        phone_number = ${body.phone_number}
      WHERE client_code = ${id}
      RETURNING *
    `;

    return updatedUser[0];
  }

  async remove(id: number) {
    return this.db.$queryRaw`
      DELETE FROM client WHERE client_code = ${id}
    `;
  }

  async findUniqueClientAddress() {
    return this.db.$queryRaw`
      SELECT DISTINCT address FROM client
    `;
  }

  async findFirst10Clients() {
    return this.db.$queryRaw`
      SELECT * FROM client
      LIMIT 10
    `;
  }

  async findLast15Clients() {
    return this.db.$queryRaw`
      SELECT * FROM client
      ORDER BY client_code DESC
      LIMIT 15
    `;
  }

  async averagePayout() {
    return this.db.$queryRaw`
      SELECT AVG(monthly_payment) FROM contract
    `;
  }

  async maxPayout() {
    return this.db.$queryRaw`
      SELECT MAX(monthly_payment) FROM contract
    `;
  }

  async minPayout() {
    return this.db.$queryRaw`
      SELECT MIN(monthly_payment) FROM contract
    `;
  }

  async findClientById(clientId: number) {
    return this.db.$queryRaw`
      SELECT * FROM client
      WHERE client_code = ${clientId}
    `;
  }

  async findClientsByNamePattern(pattern: string) {
    return this.db.$queryRaw`
      SELECT * FROM client
      WHERE 
        name ILIKE '%${pattern}%' OR
        surname ILIKE '%${pattern}%' OR
        lastname ILIKE '%${pattern}%' OR
        address ILIKE '%${pattern}%' OR
        phone_number ILIKE '%${pattern}%' OR
        passport_data ILIKE '%${pattern}%'
    `;
  }

  async findClientsWithAddressAndNoPhoneNumber() {
    return this.db.$queryRaw`
      SELECT * FROM client
      WHERE 
        address IS NOT NULL AND
        phone_number IS NULL
    `;
  }

  async findClientsWithAddressOrPhoneNumber() {
    return this.db.$queryRaw`
      SELECT * FROM client
      WHERE 
        address IS NOT NULL OR
        phone_number IS NOT NULL
    `;
  }

  async findClientsWithoutAddressOrPhoneNumber() {
    return this.db.$queryRaw`
      SELECT * FROM client
      WHERE 
        address IS NULL AND
        phone_number IS NULL
    `;
  }

  async Exists(address: string) {
    return this.db.$queryRaw`
      SELECT * FROM client
      WHERE 
        address = ${address}
    `;
  }

  async findClientsWithPhoneNumber() {
    return this.db.$queryRaw`
      SELECT * FROM client
      WHERE 
        phone_number IS NOT NULL
    `;
  }

  async clientsWithPayoutBetween(body: ClientsWithPayoutBetweenDto) {
    return this.db.$queryRaw`
      SELECT c.*, SUM(co.monthly_payment) as total_payout
      FROM client c
      JOIN contract co ON c.client_code = co.client_code
      GROUP BY c.client_code
      HAVING SUM(co.monthly_payment) BETWEEN ${body.min} AND ${body.max}
    `;
  }

  async findClientsSorted() {
    return this.db.$queryRaw`
      SELECT * FROM client
      ORDER BY name ASC, client_code DESC
    `;
  }

  async countContractsPerClient() {
    return this.db.$queryRaw`
      SELECT c.client_code, c.name, c.surname, c.lastname, c.address, c.phone_number, c.passport_data, c.salary, c.workplace, c.birthday, COUNT(co.client_code) as contracts_count
      FROM client c
      LEFT JOIN contract co ON c.client_code = co.client_code
      GROUP BY c.client_code, c.name, c.surname, c.lastname, c.address, c.phone_number, c.passport_data, c.salary, c.workplace, c.birthday
      ORDER BY contracts_count DESC
    `;
  }

  async findClientsWithNamesStartingAOrB() {
    return this.db.$queryRaw`
      (SELECT * FROM client WHERE name ILIKE 'А%')
      EXCEPT
      (SELECT * FROM client WHERE name ILIKE 'Б%')
      ORDER BY name ASC
    `;
  }

  async findClientsCelebratingEveryFiveYearsAnniversaryNextMonth() {
    const today = new Date();
    const nextMonth = today.getMonth() + 1;
    const nextMonthYear = today.getFullYear() + (nextMonth === 12 ? 1 : 0);
    const formattedDate = `${nextMonthYear}-${String(
      (nextMonth % 12) + 1,
    ).padStart(2, '0')}-01`;

    return this.db.$queryRaw`
      SELECT 
        client_code,
        name,
        surname,
        lastname,
        birthday,
        workplace,
        EXTRACT(YEAR FROM age(timestamp '${formattedDate}', birthday)) + 1 AS age_next_month,
        EXTRACT(MONTH FROM birthday) AS birth_month,
        EXTRACT(DAY FROM birthday) AS birth_day,
        (EXTRACT(YEAR FROM birthday) + (EXTRACT(YEAR FROM age(timestamp '${formattedDate}', birthday)) + 1) / 5 * 5) AS next_anniversary_year
      FROM 
        client
      WHERE
        EXTRACT(MONTH FROM birthday) = ${(nextMonth % 12) + 1} AND
        (EXTRACT(YEAR FROM age(timestamp '${formattedDate}', birthday)) + 1) % 5 = 0
      ORDER BY next_anniversary_year ASC
    `;
  }
}
