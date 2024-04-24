import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClientsService } from './dto/clients.service.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiTags } from '@nestjs/swagger';
import { ClientsWithPayoutBetweenDto } from './dto/clientsWithPayoutBetween.dto';
import { ExistsAddressDto } from './dto/existDTO';
import { FindClientsByNamePatternDto } from './dto/findClientsByNamePattern.dto';

@Controller('clients')
@ApiTags('Clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiTags('Лаба 1')
  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  //2
  @ApiTags('Лаба 2')
  @Get('/findUniqueClientAddress')
  findUniqueClientAddress() {
    return this.clientsService.findUniqueClientAddress();
  }

  //3
  @ApiTags('Лаба 3')
  @Get('/findFirst10Clients')
  findFirst10Clients() {
    return this.clientsService.findFirst10Clients();
  }

  //4
  @ApiTags('Лаба 4')
  @Get('/findLast15Clients')
  findLast15Clients() {
    return this.clientsService.findLast15Clients();
  }

  //5
  @ApiTags('Лаба 5.1')
  @Get('/averagePayout')
  averagePayout() {
    return this.clientsService.averagePayout();
  }

  //5
  @ApiTags('Лаба 5.2')
  @Get('/maxPayout')
  maxPayout() {
    return this.clientsService.maxPayout();
  }

  //5
  @ApiTags('Лаба 5.3')
  @Get('/minPayout')
  minPayout() {
    return this.clientsService.minPayout();
  }
  //6.3
  @ApiTags('Лаба 6.3')
  @Post('/findClientsByNamePattern')
  findClientsByNamePattern(
    @Body() findClientsByNamePattern: FindClientsByNamePatternDto,
  ) {
    return this.clientsService.findClientsByNamePattern(
      findClientsByNamePattern.pattern,
    );
  }
  //6.4
  @ApiTags('Лаба 6.4 И')
  @Get('/findClientsWithAddressAndNoPhoneNumber')
  findClientsWithAddressAndNoPhoneNumber() {
    return this.clientsService.findClientsWithAddressAndNoPhoneNumber();
  }

  @ApiTags('Лаба 6.4 ИЛИ')
  @Get('/findClientsWithAddressOrPhoneNumber')
  findClientsWithAddressOrPhoneNumber() {
    return this.clientsService.findClientsWithAddressOrPhoneNumber();
  }

  @ApiTags('Лаба 6.4 НЕ')
  @Get('/findClientsWithoutAddressOrPhoneNumber')
  findClientsWithoutAddressOrPhoneNumber() {
    return this.clientsService.findClientsWithoutAddressOrPhoneNumber();
  }

  @ApiTags('Лаба 6.4 EXISTS')
  @Post('/exists')
  exists(@Body() data: ExistsAddressDto) {
    return this.clientsService.Exists(data.address);
  }
  //6.5
  @ApiTags('Лаба 6.5')
  @Get('/findClientsWithPhoneNumber')
  findClientsWithPhoneNumber() {
    return this.clientsService.findClientsWithPhoneNumber();
  }
  // 7
  @ApiTags('Лаба 7')
  @Post('clientsWithPayoutBetween')
  clientsWithPayoutBetween(
    @Body() clientsWithPayoutBetween: ClientsWithPayoutBetweenDto,
  ) {
    return this.clientsService.clientsWithPayoutBetween(
      clientsWithPayoutBetween,
    );
  }
  // 8
  @ApiTags('Лаба 8')
  @Get('/findClientsSorted')
  findClientsSorted() {
    return this.clientsService.findClientsSorted();
  }

  // 9
  @ApiTags('Лаба 9')
  @Get('/countContractsPerClient')
  countContractsPerClient() {
    return this.clientsService.countContractsPerClient();
  }

  // 10
  @ApiTags('Лаба 10')
  @Get('/findClientsWithNamesStartingAOrB')
  findClientsWithNamesStartingAOrB() {
    return this.clientsService.findClientsWithNamesStartingAOrB();
  }

  // 11
  @ApiTags('Лаба 11')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  // 12
  @ApiTags('Лаба 12')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }

  // 13
  @ApiTags('Лаба 13')
  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @ApiTags('Лаба 14')
  @Get('findClientsCelebratingEveryFiveYearsAnniversaryNextMonth')
  findClientsCelebratingEveryFiveYearsAnniversaryNextMonth() {
    return this.clientsService.findClientsCelebratingEveryFiveYearsAnniversaryNextMonth();
  }

  @ApiTags('Лаба 6.1')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }
}
