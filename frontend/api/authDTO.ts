export interface AccountInfo {
  email: string;
  username: string;
}

export interface CreateAuthDTO {
  token: string;
  registerUser?: boolean;
  accountInfo?: AccountInfo; 
}



export interface Credentials {
  id: number
  accessToken: string
  refreshToken: string
}
