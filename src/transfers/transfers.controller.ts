import { Body, Controller, Inject, Post } from '@nestjs/common';
import { DITokens } from '../common/enums/DITokens';
import { TransferOperationDto } from './dto/transfers.dto';
import { TrasnfersService } from './service/interfaces/transfers.service';
import { TransfersValidationPipe } from './validation.pipe';

@Controller('transfers')
export class TransfersController {
  constructor(
    @Inject(DITokens.TrasnfersService)
    private readonly transfersService: TrasnfersService,
  ) {}

  @Post()
  async transfer(
    @Body(new TransfersValidationPipe())
    transferOperationDto: TransferOperationDto,
  ) {
    return this.transfersService.transfer(transferOperationDto);
  }
}
