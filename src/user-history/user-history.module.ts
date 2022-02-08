import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TransfersModule } from 'src/transfers/transfers.module';
import { TransactionsHistoryController } from './user-history.controller';
import { HistoryService } from './user-history.service';

@Module({
  imports: [AccountsModule, TransfersModule],
  controllers: [TransactionsHistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
