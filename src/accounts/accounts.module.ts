import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsController } from './accounts.controller';
import { AccountsDao } from './accounts.dao';
import { AccountsService } from './accounts.service';
import { Accounts } from './entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accounts])],
  controllers: [AccountsController],
  providers: [AccountsService, AccountsDao],
  exports: [AccountsService, AccountsDao],
})
export class AccountsModule {}
