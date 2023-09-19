import { Context } from 'hono';
import authService from './auth.service';

function isEmail(str: string) {
  // This is a basic regex for email validation. Depending on your needs, you might want to use a more comprehensive one.
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(str);
}

class AuthController {
  async signIn(c: Context) {
    const { identifier, password } = await c.req.json();

    let type = 'username';
    if (isEmail(identifier)) {
      type = 'email';
    } else {
      type = 'username';
    }

    const data = await authService.signIn(identifier, password, type);

    return c.json(data);
  }
}

export default new AuthController();
