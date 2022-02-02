import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransferOperationDto {
  @IsString()
  @IsNotEmpty()
  senderDocument: string;

  @IsString()
  @IsNotEmpty()
  receiverDocument: string;

  @IsNumber()
  value: number;
}
