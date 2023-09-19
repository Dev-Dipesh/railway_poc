type UUID = string;

export interface JwtPayload {
  id: UUID;
  iat: number;
  exp: number;
}
