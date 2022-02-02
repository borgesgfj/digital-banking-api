import { Injectable } from '@nestjs/common';
import { Account } from './interfaces/account.interface';

@Injectable()
export class AccountsDao {
  private readonly accounts: Account[] = [];
  private idCounter = 0;

  getByDocument(document: string): Account {
    return this.accounts.find(
      (registredAccount) => registredAccount.document === document,
    );
  }

  save(account: Account): Account {
    this.idCounter++;
    const newAccount: Account = {
      id: this.idCounter.toString(),
      ...account,
    };
    this.accounts.push(newAccount);
    return newAccount;
  }
  // TODO (GILBERTO): Usar um findIndex ou indexOf
  updateValue(document: string, updatedValue: number) {
    this.accounts.forEach((registredAcc, index) => {
      if (registredAcc.document === document) {
        return (this.accounts[index] = {
          ...registredAcc,
          availableValue: updatedValue,
        });
      }
      return registredAcc;
    });
  }
}
