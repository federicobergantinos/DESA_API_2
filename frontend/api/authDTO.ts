export interface createAuthDTO {
  token: string;
  registerUser?: boolean;
}


export interface Credentials {
  id: number
  accessToken: string
  refreshToken: string
}
