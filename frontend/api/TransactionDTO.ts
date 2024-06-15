export interface TransactionDTO {
  id: number
  name: string
  description: string
  amount: number
  currencyOrigin: string
  currencyDestination: string
  accountNumberOrigin: string
  accountNumberDestination: string
  date: Date
}
