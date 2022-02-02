import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ValidatorValue {
  validate(availableValue: number, transferValue: number) {
    if (availableValue < transferValue) {
      throw new BadRequestException(
        'Insuficient account founds. Transferece can not be concluded.',
      );
    }
  }
}
