import { Injectable } from '@nestjs/common';
import { Account, AccountResponse } from './interfaces/account.interface';

@Injectable()
export class AccountsService {
  readonly accounts: Account[] = [];
  idCounter = 0;

  getHello(): string {
    return 'Olá! Bem vindes ao Banco Digital';
  }

  create(account: Account) {
    this.idCounter++;
    const newAccount: AccountResponse = {
      id: this.idCounter.toString(),
      ...account,
    };
    this.accounts.push(newAccount);
    return newAccount;
  }
}
