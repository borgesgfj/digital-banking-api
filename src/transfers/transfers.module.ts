import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TrasnfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { AccountsTransfersDao } from './accounts-transfers.dao';
import { TransfersDao } from './transfers.dao';
import { TransfersValidations } from './transfers-validation';
import { HandleRequestTime } from './transfer-date';

@Module({
  imports: [AccountsModule],
  controllers: [TransfersController],
  providers: [
    TrasnfersService,
    AccountsTransfersDao,
    TransfersDao,
    TransfersValidations,
    HandleRequestTime,
  ],
  exports: [TransfersDao],
})
export class TransfersModule {}
