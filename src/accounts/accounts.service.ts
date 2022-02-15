import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountsDao } from './accounts.dao';
import { Accounts } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsDao: AccountsDao) {}

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
