import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TrasnfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { AccountsTransfersDao } from './accounts-transfers.dao';
import { TransfersDao } from './transfers.dao';
import { ValidatorValue } from './validator-value';
import { HandleRequestTime } from './transfer-date';

@Module({
  imports: [AccountsModule],
  controllers: [TransfersController],
  providers: [
    TrasnfersService,
    AccountsTransfersDao,
    TransfersDao,
    ValidatorValue,
    HandleRequestTime,
  ],
})
export class TransfersModule {}
