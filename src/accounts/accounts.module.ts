import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DITokens } from 'src/common/enums/DITokens';
import { AccountsController } from './accounts.controller';
import { AccountsDao } from './accounts.dao.impl';
import { AccountsServiceImpl } from './accounts.service.impl';
import { Accounts } from './entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accounts])],
  controllers: [AccountsController],
  providers: [
    { provide: DITokens.AccountsService, useClass: AccountsServiceImpl },
    { provide: DITokens.AccountsDao, useClass: AccountsDao },
  ],
  exports: [
    { provide: DITokens.AccountsService, useClass: AccountsServiceImpl },
    { provide: DITokens.AccountsDao, useClass: AccountsDao },
  ],
})
export class AccountsModule {}
