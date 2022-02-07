import { Body, Controller, Post } from '@nestjs/common';
import { TransferOperationDto } from './dto/transfers.dto';
import { TrasnfersService } from './transfers.service';
import { TransfersValidationPipe } from './validation.pipe';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TrasnfersService) {}

  @Post()
  async transfer(
    @Body(new TransfersValidationPipe())
    transferOperationDto: TransferOperationDto,
  ) {
    return this.transfersService.transfer(transferOperationDto);
  }
}
