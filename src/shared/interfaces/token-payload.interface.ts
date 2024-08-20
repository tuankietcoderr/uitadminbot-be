export interface ITokenPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}
