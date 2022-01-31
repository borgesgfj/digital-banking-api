import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any) {
    const result = createAccountSchema.validate(value);
    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      throw new BadRequestException(errorMessages);
    }
    return {
      name: result.value.name,
      document: result.value.document,
      availableValue: result.value.availableValue,
    };
  }
}

const createAccountSchema: Joi.ObjectSchema<CreateAccountDto> = Joi.object({
  name: Joi.string().required(),
  document: Joi.string().required(),
  availableValue: Joi.number().required(),
}).options({ abortEarly: false });
