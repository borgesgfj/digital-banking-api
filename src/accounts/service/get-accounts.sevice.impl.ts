import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DITokens } from '../../common/enums/DITokens';
import { Accounts } from '../entities/account.entity';
import { IAccountsDao } from '../dao/interfaces/accounts.dao';
import { GetAccountsService } from './interfaces/get-accounts.service';

@Injectable()
export class GetAccountsServiceImpl implements GetAccountsService {
  constructor(
    @Inject(DITokens.AccountsDao) private readonly accountsDao: IAccountsDao,
  ) {}

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
