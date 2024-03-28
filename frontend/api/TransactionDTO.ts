export interface TransactionDTO {
  id: number;
  title: string;
  description: string;
  preparationTime: string;
  servingCount: number;
  ingredients: string[];
  steps: string[];
  calories: number;
  proteins: number;
  totalFats: number;
  userId: number;
  media: string[];
  username: string;
  userImage: string;
}
