import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DITokens } from '../../common/enums/DITokens';
import { Accounts } from '../entities/account.entity';
import { IAccountsDao } from '../dao/interfaces/accounts.dao';
import { CreateAccountsService } from './interfaces/create-accounts.service';

@Injectable()
export class CreateAccountsServiceImpl implements CreateAccountsService {
  constructor(
    @Inject(DITokens.AccountsDao) private readonly accountsDao: IAccountsDao,
  ) {}
  async create(account: Accounts) {
    const acc = await this.accountsDao.getByDocument(account.document);
    if (acc) {
      throw new BadRequestException(
        'Document already registred. Unable to create new account',
      );
    }

    return this.accountsDao.save(account);
  }
}
