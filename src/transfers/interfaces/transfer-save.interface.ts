export interface AccountTransfer {
  id: string;
  senderDocument: string;
  receiverDocument: string;
  value: number;
  dateTime: string;
}

export interface TransferSaveInput {
  senderDocument: string;
  receiverDocument: string;
  value: number;
  dateTime: string;
}
