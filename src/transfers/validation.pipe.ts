import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';
import { TransferOperationDto } from './dto/transfers.dto';

@Injectable()
export class TransfersValidationPipe implements PipeTransform {
  transform(value: any) {
    const result = transfersSchema.validate(value);
    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      throw new BadRequestException(errorMessages);
    }
    return {
      senderDocument: result.value.senderDocument,
      receiverDocument: result.value.receiverDocument,
      value: result.value.value,
    };
  }
}

const transfersSchema: Joi.ObjectSchema<TransferOperationDto> = Joi.object({
  senderDocument: Joi.string().required(),
  receiverDocument: Joi.string().required(),
  value: Joi.number().required(),
});
