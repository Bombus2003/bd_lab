import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('contracts')
@ApiTags('Contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  create(@Body() createContractDto: CreateContractDto) {
    return this.contractsService.create(createContractDto);
  }

  @Get()
  findAll(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.contractsService.findAll(startDate, endDate);
  }

  @ApiTags('Лаба 6.2 Min/Contracts')
  @Get('min')
  findAllMin(@Query('payoutAmount') payoutAmount: number) {
    // Изменение на payoutAmount
    return this.contractsService.findAllMin(payoutAmount); // Использование payoutAmount
  }

  @ApiTags('Лаба 6.2 Max/Contracts')
  @Get('max')
  findAllMax(@Query('payoutAmount') payoutAmount: number) {
    // Изменение на payoutAmount
    return this.contractsService.findAllMax(payoutAmount); // Использование payoutAmount
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractsService.update(+id, updateContractDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contractsService.remove(+id);
  }
}
