import * as jose from 'jose';
import { JwtPayload } from './jwt.types';

export function isJwtPayload(object: any): object is JwtPayload {
  return 'id' in object && typeof object.id === 'string' && 
         'iat' in object && typeof object.iat === 'number' &&
         'exp' in object && typeof object.exp === 'number';
}

export async function getUserIdFromHeader(req: any): Promise<string> {
    const header = req.header("Authorization")!.split(" ")[1];
    const secretUint8Array = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(header, secretUint8Array);

    if (!isJwtPayload(payload)) {
      throw new Error("Invalid payload");
    }
    
    return payload.id;
}
