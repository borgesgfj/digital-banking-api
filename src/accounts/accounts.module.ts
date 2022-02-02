import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsDao } from './accounts.dao';
import { AccountsService } from './accounts.service';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, AccountsDao],
  exports: [AccountsService, AccountsDao],
})
export class AccountsModule {}
