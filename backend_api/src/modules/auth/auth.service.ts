import usersService from '../users/users.service';
import { HTTPException } from 'hono/http-exception';
import * as jose from 'jose';

class AuthService {
  async signIn(identifier: string, password: string, type: string) {
    let user = null;
    if (type === 'email') {
      user = await usersService.findByEmail(identifier);
    } else {
      user = await usersService.findByUsername(identifier);
    }

    if (!user) throw new HTTPException(404, { message: 'User not found.' });

    const isValidPassword = await Bun.password.verify(password, user.password, 'bcrypt');

    if (!isValidPassword) throw new HTTPException(401, { message: 'Unauthorized' });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const accessToken = await new jose.SignJWT({ id: user.user_id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2d')
      .sign(secret);

    return { accessToken };
  }
}

export default new AuthService();
