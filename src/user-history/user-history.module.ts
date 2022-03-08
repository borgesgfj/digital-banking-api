import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { DITokens } from 'src/common/enums/DITokens';
import { TransfersModule } from 'src/transfers/transfers.module';
import { HistoryServiceImpl } from './service/user-history.service.impl';
import { TransactionsHistoryController } from './user-history.controller';

@Module({
  imports: [AccountsModule, TransfersModule],
  controllers: [TransactionsHistoryController],
  providers: [
    { provide: DITokens.HistoryService, useClass: HistoryServiceImpl },
  ],
})
export class HistoryModule {}
