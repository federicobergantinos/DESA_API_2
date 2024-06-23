export interface AccountInfo {
  beneficiaryAddress: string;
  accountType: string;
}

export interface CreateAuthDTO {
  token: string;
  email: string;
  registerUser?: boolean;
  accountInfo?: AccountInfo; 
}



export interface Credentials {
  id: number
  accessToken: string
  refreshToken: string
}
