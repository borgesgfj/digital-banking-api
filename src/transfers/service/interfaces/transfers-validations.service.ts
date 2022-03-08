export interface TransfersValidations {
  validateValue(availableValue: number, transferValue: number): void;

  validateDuplicatedTransfer(
    senderDoc: string,
    receiverDoc: string,
    transferValue: number,
    timeStamp: string,
    transferTimeOut: number,
  ): Promise<void>;
}
