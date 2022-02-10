import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Accounts } from './entities/account.entity';
import { ValidationPipe } from './validation.pipe';

@Controller()
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

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
