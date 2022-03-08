import { IAccountsDao } from 'src/accounts/dao/interfaces/accounts.dao';
import { Accounts } from '../../src/accounts/entities/account.entity';

export class InMemoryAccountsDao implements IAccountsDao {
  private readonly accounts: Accounts[] = [];
  private idCounter = 0;

  async getByDocument(document: string): Promise<Accounts> {
    return await this.accounts.find(
      (registredAccount) => registredAccount.document === document,
    );
  }

  async save(account: Accounts): Promise<Accounts> {
    this.idCounter++;
    const newAccount: Accounts = {
      id: this.idCounter,
      ...account,
    };
    await this.accounts.push(newAccount);
    return newAccount;
  }

  async updateValue(accId: number, updatedValue: number): Promise<void> {
    this.accounts.forEach((registredAcc, index) => {
      if (registredAcc.id === accId) {
        return (this.accounts[index] = {
          ...registredAcc,
          availableValue: updatedValue,
        });
      }
      return registredAcc;
    });
  }
}
