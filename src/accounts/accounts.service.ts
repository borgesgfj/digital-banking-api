import { BadRequestException, Injectable } from '@nestjs/common';
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
    const isAccountRegistred = this.accounts.some(
      (registredAccount) =>
        registredAccount.document === createAccountDto.document,
    );

    if (!isAccountRegistred) {
      this.idCounter++;
      const newAccount: Account = {
        id: this.idCounter.toString(),
        ...createAccountDto,
      };
      this.accounts.push(newAccount);
      console.log(this.accounts);
      return newAccount;
    } else {
      console.log(this.accounts);
      throw new BadRequestException(
        'Document already registred. Unable to create new account',
      );
    }
  }
}
