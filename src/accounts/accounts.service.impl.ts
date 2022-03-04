import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DITokens } from '../common/enums/DITokens';
import { Accounts } from './entities/account.entity';
import { IAccountsDao } from './interfaces/accounts.dao';
import { IAccountsService } from './interfaces/accounts.service';

@Injectable()
export class AccountsServiceImpl implements IAccountsService {
  constructor(
    @Inject(DITokens.AccountsDao) private readonly accountsDao: IAccountsDao,
  ) {}

  getHello(): string {
    return 'Olá! Bem vindes ao Banco Digital';
  }

  async create(account: Accounts) {
    const acc = await this.accountsDao.getByDocument(account.document);
    if (acc) {
      throw new BadRequestException(
        'Document already registred. Unable to create new account',
      );
    }

    return this.accountsDao.save(account);
  }

  async getByDocumentOrDie(document: string): Promise<Accounts> {
    const account = await this.accountsDao.getByDocument(document);
    if (!account) {
      throw new BadRequestException(
        'Document not registred. Please check this information and try again',
      );
    }

    return account;
  }
}
