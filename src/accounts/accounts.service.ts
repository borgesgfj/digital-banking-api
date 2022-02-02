import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountsDao } from './accounts.dao';
import { Account } from './interfaces/account.interface';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsDao: AccountsDao) {}

  getHello(): string {
    return 'Olá! Bem vindes ao Banco Digital';
  }

  create(account: Account) {
    const acc = this.accountsDao.getByDocument(account.document);
    if (acc) {
      throw new BadRequestException(
        'Document already registred. Unable to create new account',
      );
    }

    return this.accountsDao.save(account);
  }

  getByDocumentOrDie(document: string): Account {
    const account = this.accountsDao.getByDocument(document);

    if (!account) {
      throw new BadRequestException(
        'Document not registred. Please check this information and try again',
      );
    }

    return account;
  }
}
