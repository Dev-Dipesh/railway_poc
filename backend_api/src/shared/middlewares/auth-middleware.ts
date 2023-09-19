import { jwt } from 'hono/jwt';

export function authMiddleware() {
  return jwt({ secret: <string>process.env.JWT_SECRET });
}
