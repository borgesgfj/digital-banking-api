import { Accounts } from '../entities/account.entity';

export interface IAccountsService {
  getHello(): string;

  create(account: Accounts): Promise<Accounts>;

  getByDocumentOrDie(document: string): Promise<Accounts>;
}
