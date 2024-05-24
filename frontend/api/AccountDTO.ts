export interface AccountDTO {
  id: number
  beneficiaryName: string
  beneficiaryAddress: string
  accountNumber: number
  accountType: string
  accountCurrency: string;
}


export interface AccountSummaryDTO {
  accountId: number;
  accountNumber: string;
  accountType: string;
  accountCurrency: string;
}