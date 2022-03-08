import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { DITokens } from '../common/enums/DITokens';
import { CreateAccountDto } from './dto/create-account.dto';
import { Accounts } from './entities/account.entity';
import { CreateAccountsService } from './service/interfaces/create-accounts.service';
import { GetAccountsService } from './service/interfaces/get-accounts.service';
import { ValidationPipe } from './validation.pipe';

@Controller()
export class AccountsController {
  constructor(
    @Inject(DITokens.GetAccountsService)
    private getAccountsService: GetAccountsService,
    @Inject(DITokens.CreateAccountsService)
    private createAccountsService: CreateAccountsService,
  ) {}

  @Get()
  getHello(): string {
    return 'Olá! Bem vindes ao Banco Digital';
  }

  @Post('create-account')
  async create(
    @Body(new ValidationPipe())
    createAccountDto: CreateAccountDto,
  ) {
    return this.createAccountsService.create(<Accounts>{ ...createAccountDto });
  }
}
