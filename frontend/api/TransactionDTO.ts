export interface TransactionDTO {
  id: number
  name: string
  description: string
  amountOrigin: number
  amountDestination: number
  currencyOrigin: string
  currencyDestination: string
  accountNumberOrigin: string
  accountNumberDestination: string
  date: Date
}
