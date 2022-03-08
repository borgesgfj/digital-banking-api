import { Accounts } from '../../entities/account.entity';

export interface CreateAccountsService {
  create(account: Accounts): Promise<Accounts>;
}
