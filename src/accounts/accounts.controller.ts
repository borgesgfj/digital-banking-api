import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { DITokens } from '../common/enums/DITokens';
import { AccountsServiceImpl } from './accounts.service.impl';
import { CreateAccountDto } from './dto/create-account.dto';
import { Accounts } from './entities/account.entity';
import { ValidationPipe } from './validation.pipe';

@Controller()
export class AccountsController {
  constructor(
    @Inject(DITokens.AccountsService)
    private accountsService: AccountsServiceImpl,
  ) {}

  @Get()
  getHello(): string {
    return this.accountsService.getHello();
  }

  @Post('create-account')
  async create(
    @Body(new ValidationPipe())
    createAccountDto: CreateAccountDto,
  ) {
    return this.accountsService.create(<Accounts>{ ...createAccountDto });
  }
}
