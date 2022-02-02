import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { TransfersModule } from './transfers/transfers.module';

@Module({
  imports: [AccountsModule, TransfersModule],
})
export class AppModule {}
