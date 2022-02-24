import { Accounts } from '../entities/account.entity';

export interface IAccountsDao {
  getByDocument(doc: string): Promise<Accounts>;

  save(account: Accounts): Promise<Accounts>;

  updateValue(accId: number, updatedValue: number): Promise<void>;
}
