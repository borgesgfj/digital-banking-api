import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accounts } from './entities/account.entity';

@Injectable()
export class AccountsDao {
  constructor(
    @InjectRepository(Accounts)
    private accountsRepository: Repository<Accounts>,
  ) {}

  async getByDocument(doc: string): Promise<Accounts> {
    const acc = await this.accountsRepository.findOne({ document: doc });
    return acc;
  }

  async save(account: Accounts): Promise<Accounts> {
    await this.accountsRepository.save(account);
    const newAccount = await this.getByDocument(account.document);
    return newAccount;
  }
  async updateValue(accId: number, updatedValue: number) {
    await this.accountsRepository.update(accId, {
      availableValue: updatedValue,
    });
  }
}
