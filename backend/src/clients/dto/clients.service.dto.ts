import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './create-client.dto';
import { UpdateClientDto } from './update-client.dto';
import { PrismaService } from 'src/utils/prisma.service';
import { ClientsWithPayoutBetweenDto } from './clientsWithPayoutBetween.dto';

@Injectable()
export class ClientsService {
  constructor(private db: PrismaService) {}
  async create(body: CreateClientDto) {
    const checkExistPassport = await this.db.client.findFirst({
      where: { passport_data: body?.passport_data },
    });
    if (checkExistPassport) {
      throw new ConflictException('Клиент с таким паспортом существует');
    }

    const client = await this.db.client.create({
      data: {
        surname: body.surname,
        name: body.name,
        lastname: body.lastname,
        birthday: new Date(body.birthday),
        passport_data: body.passport_data,
        salary: body.salary,
        workplace: body.workplace,
        address: body.address,
        phone_number: body.phone_number,
      },
    });

    return client;
  }

  async findAll() {
    const clientsWithSums = await this.db.client.findMany({
      include: {
        contract: {
          select: {
            monthly_payment: true,
          },
        },
      },
    });

    return clientsWithSums;
  }

  async findOne(id: number) {
    const client = await this.db.client.findFirst({
      where: { client_code: id },
    });

    if (!client) {
      throw new NotFoundException('Клиент не найден');
    }
    return client;
  }

  async update(id: number, body: UpdateClientDto) {
    const updatedUser = await this.db.client.update({
      where: { client_code: id },
      data: {
        surname: body.surname,
        name: body.name,
        lastname: body.lastname,
        birthday: new Date(body.birthday),
        passport_data: body.passport_data,
        salary: body.salary,
        workplace: body.workplace,
        address: body.address,
        phone_number: body.phone_number,
      },
    });
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async remove(id: number) {
    const client = await this.db.client.findUnique({
      where: { client_code: id },
      include: { contract: true },
    });

    if (client) {
      if (client.contract.length > 0) {
        throw new ConflictException(
          `Клиент ${
            client.surname + ' ' + client.name
          } имеет активные кредиты. Его нельзя удалить. (Сначала удалите кредиты связанные с этим клиентом)`,
        );
      }

      const deletedClient = await this.db.client.delete({
        where: { client_code: id },
      });
      return `Клиент ${
        deletedClient.surname + ' ' + deletedClient.name
      } успешно удален, и кредиты, связанные с ним, также удалены.`;
    }

    throw new NotFoundException(`Клиент ${id} не найден.`);
  }

  // 2
  async findUniqueClientAddress() {
    return this.db.client.findMany({
      distinct: ['address'],
    });
  }

  // 3
  async findFirst10Clients() {
    return this.db.client.findMany({
      take: 10,
    });
  }

  // 4
  async findLast15Clients() {
    return this.db.client.findMany({
      take: -15,
    });
  }

  // 5
  async averagePayout() {
    return this.db.$queryRaw`SELECT AVG(monthly_payment) FROM contract`;
  }

  // 5
  async maxPayout() {
    return this.db.$queryRaw`SELECT MAX(monthly_payment) FROM contract`;
  }

  // 5
  async minPayout() {
    return this.db.$queryRaw`SELECT MIN(monthly_payment) FROM contract`;
  }

  // 6
  // 6.1
  async findClientById(clientId: number) {
    return this.db.client.findUnique({
      where: {
        client_code: clientId,
      },
    });
  }

  // 6.3
  async findClientsByNamePattern(pattern: string) {
    return this.db.client.findMany({
      where: {
        OR: [
          {
            name: {
              contains: pattern,
              mode: 'insensitive',
            },
          },
          {
            surname: {
              contains: pattern,
              mode: 'insensitive',
            },
          },
          {
            lastname: {
              contains: pattern,
              mode: 'insensitive',
            },
          },
          {
            address: {
              contains: pattern,
              mode: 'insensitive',
            },
          },
          {
            phone_number: {
              contains: pattern,
              mode: 'insensitive',
            },
          },
          {
            passport_data: {
              contains: pattern,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }
  // 6.4
  async findClientsWithAddressAndNoPhoneNumber() {
    return this.db.client.findMany({
      where: {
        AND: [
          {
            address: {
              not: null, // Адрес указан
            },
          },
          {
            phone_number: null, // Паспортные данные не указаны
          },
        ],
      },
    });
  }

  async findClientsWithAddressOrPhoneNumber() {
    return this.db.client.findMany({
      where: {
        OR: [
          {
            address: {
              not: null, // Адрес указан
            },
          },
          {
            phone_number: {
              not: null, // Паспортные данные указаны
            },
          },
        ],
      },
    });
  }

  async findClientsWithoutAddressOrPhoneNumber() {
    const clients = await this.db.client.findMany({
      where: {
        NOT: [
          {
            address: null, // Адрес не указан
            phone_number: null, // Паспортные данные не указаны
          },
        ],
      },
    });

    return clients.length > 0 ? [clients[0]] : null;
  }

  async Exists(address: string) {
    const clients = await this.db.client.findMany({
      where: {
        address,
      },
      include: {
        contract: {
          select: {
            monthly_payment: true,
          },
        },
      },
    });

    if (!clients) {
      throw new NotFoundException('Клиент не найден');
    }

    return clients.length > 0 ? [clients[0]] : 'Не найдено';
  }
  // 6.5
  async findClientsWithPhoneNumber() {
    return this.db.client.findMany({
      where: {
        phone_number: {
          not: null, // Имеется номер телефона
        },
      },
    });
  }

  // 7
  async clientsWithPayoutBetween(body: ClientsWithPayoutBetweenDto) {
    return this.db.$queryRaw`
    SELECT c.*, SUM(co.monthly_payment) as total_payout
    FROM client c
    JOIN contract co ON c.client_code = co.client_code
    GROUP BY c.client_code
    HAVING SUM(co.monthly_payment) BETWEEN ${body.min} AND ${body.max}`;
  }

  // 8
  async findClientsSorted() {
    return this.db.client.findMany({
      orderBy: [
        {
          name: 'asc',
        },
        {
          client_code: 'desc',
        },
      ],
    });
  }
  // 9
  async countContractsPerClient() {
    return this.db.client.findMany({
      select: {
        client_code: true,
        name: true,
        surname: true,
        lastname: true,
        address: true,
        phone_number: true,
        passport_data: true,
        salary: true,
        workplace: true,
        birthday: true,
        _count: {
          select: {
            contract: true,
          },
        },
      },
      orderBy: {
        contract: {
          _count: 'desc',
        },
      },
    });
  }

  //10
  async findClientsWithNamesStartingAOrB() {
    return this.db.$queryRaw`
      (SELECT * FROM client WHERE name LIKE 'А%')
      EXCEPT
      (SELECT * FROM client WHERE name LIKE 'Б%')
      ORDER BY name ASC`;
  }

  //14
  async findClientsCelebratingEveryFiveYearsAnniversaryNextMonth() {
    const today = new Date();
    const nextMonth = today.getMonth() + 1;
    const nextMonthYear = today.getFullYear() + (nextMonth === 12 ? 1 : 0);
    const formattedDate = `${nextMonthYear}-${String(
      (nextMonth % 12) + 1,
    ).padStart(2, '0')}-01`;
    console.log(formattedDate);
    const query = `
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
    `;

    const clientsCelebratingAnniversary = (await this.db.$queryRawUnsafe(
      query,
    )) as any[];

    const clientsWithNextAnniversaryDate = clientsCelebratingAnniversary.map(
      (client) => {
        const nextAnniversaryDateString = `${
          client.next_anniversary_year
        }-${String(client.birth_month).padStart(2, '0')}-${String(
          client.birth_day,
        ).padStart(2, '0')}`;

        return {
          ...client,
          next_anniversary_date: `${nextAnniversaryDateString}T00:00:00.000Z`,
        };
      },
    );

    return clientsWithNextAnniversaryDate;
  }
}
