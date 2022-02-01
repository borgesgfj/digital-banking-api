import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './interfaces/account.interface';

@Injectable()
export class AccountsService {
  readonly accounts: Account[] = [];
  idCounter = 0;

  getHello(): string {
    return 'Olá! Bem vindes ao Banco Digital';
  }

  create(createAccountDto: CreateAccountDto) {
    this.idCounter++;
    const newAccount: Account = {
      id: this.idCounter.toString(),
      ...createAccountDto,
    };
    this.accounts.push(newAccount);
    return newAccount;
  }
}
