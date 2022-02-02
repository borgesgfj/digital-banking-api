import { Body, Controller, Post } from '@nestjs/common';
import { TransferOperationDto } from './dto/transfers.dto';
import { TrasnfersService } from './transfers.service';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TrasnfersService) {}

  @Post()
  async transfer(@Body() transferOperationDto: TransferOperationDto) {
    return this.transfersService.transfer(transferOperationDto);
  }
}
