import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accounts } from './entities/account.entity';
import { Account } from './interfaces/account.interface';

@Injectable()
export class AccountsDao {
  constructor(
    @InjectRepository(Accounts)
    private accountsRepository: Repository<Accounts>,
  ) {}

  private readonly accounts: Account[] = [];

  private idCounter = 0;

  getByDocument(document: string): Account {
    return this.accounts.find(
      (registredAccount) => registredAccount.document === document,
    );
  }

  async findByDocument(doc: string): Promise<Accounts> {
    const acc = await this.accountsRepository.findOne({ document: doc });
    return acc;
  }

  save(account: Accounts): Promise<Accounts> {
    this.accountsRepository.save(account);
    const newAccount = this.findByDocument(account.document);
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
