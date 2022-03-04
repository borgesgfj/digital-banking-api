import { Accounts } from '../../entities/account.entity';

export interface GetAccountsService {
  getByDocumentOrDie(document: string): Promise<Accounts>;
}
