export interface Account {
  name: string;
  document: string;
  availableValue: number;
}

export interface AccountResponse extends Account {
  id: string;
}
