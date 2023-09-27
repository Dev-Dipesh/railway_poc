import { Context } from 'hono';
import usersService from './users.service';
import { CreateUser } from './users.types';

class UsersController {
  async create(c: Context) {
    const { username, email, password } = await c.req.json<CreateUser>();

    const hash = await Bun.password.hash(password, {
      algorithm: "bcrypt"
    });

    const user = await usersService.insertUser({ username, email, password: hash });

    return c.json(user);
  }
}

export default new UsersController();
