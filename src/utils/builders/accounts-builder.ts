import { Accounts } from 'src/accounts/entities/account.entity';

export class AccountsBuilder {
  static buildAccounts(name: string, document: string, id?: number): Accounts {
    return <Accounts>{
      id: id,
      name: name,
      document: document,
      availableValue: 1000,
    };
  }
}
