export interface ContactDTO {
  id: number
  title: string
  description: string
  preparationTime: string
  servingCount: number
  ingredients: string[]
  steps: string[]
  calories: number
  proteins: number
  totalFats: number
  userId: number
  media: string[]
  username: string
  userImage: string
}

export interface ContactsDTO {
  id: number
  title: string
  description: string
  preparationTime: string
}

export interface ContactsSearchDTO {
  id: number
  title: string
  media: string
  description: string
  tags: string[]
}
