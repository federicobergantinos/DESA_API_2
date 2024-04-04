export interface ContactDTO {
  id: number
  name: string
  accountNumber: string
  accountType: string
  userId: number
}


export interface UserDTO {
  name: string;
  surname: string;
}

export interface ContactsDTO {
  id: number;
  name: string;
  accountType: string;
  accountNumber: string;
  user: UserDTO;
}

